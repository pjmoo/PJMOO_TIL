# [TIL] AWS 관리형 서비스(RDS, ElastiCache, S3, ALB) 연동 및 무상태(Stateless) 아키텍처 구축

> **작성일자:** 2026-09-16  
> **실습 환경:** AWS (ap-northeast-2 서울 리전), Ubuntu Linux, Docker Compose, Spring Boot, Nginx, MySQL, Redis  
> **실습 계정:** `student08`

---

## 📌 목차
1. [핵심 개념 및 아키텍처 개요](#1-핵심-개념-및-아키텍처-개요)
2. [전체 실습 절차 및 상세 코드 해설](#2-전체-실습-절차-및-상세-코드-해설)
   - [Step 0: 환경 변수 세팅 및 인증](#step-0-환경-변수-세팅-및-인증)
   - [Step 1: EC2 컴퓨팅 노드 및 웹 보안 그룹 생성](#step-1-ec2-컴퓨팅-노드-및-웹-보안-그룹-생성)
   - [Step 2: Docker 런타임 설치 및 컨테이너 이미지 사전 확보](#step-2-docker-런타임-설치-및-컨테이너-이미지-사전-확보)
   - [Step 3: 데이터 계층 보안 그룹 및 Multi-AZ 서브넷 그룹 생성](#step-3-데이터-계층-보안-그룹-및-multi-az-서브넷-그룹-생성)
   - [Step 4: RDS MySQL & ElastiCache Redis 비동기 프로비저닝](#step-4-rds-mysql--elasticache-redis-비동기-프로비저닝)
   - [Step 5: Amazon S3 버킷 생성 및 Presigned URL 검증](#step-5-amazon-s3-버킷-생성-및-presigned-url-검증)
   - [Step 6: RDS 및 ElastiCache 프로비저닝 완료 대기 및 FQDN 확보](#step-6-rds-및-elasticache-프로비저닝-완료-대기-및-fqdn-확보)
   - [Step 7: 3-Tier Docker Compose + RDS 연동 스택 구동](#step-7-3-tier-docker-compose--rds-연동-스택-구동)
   - [Step 8: ElastiCache Redis 클러스터 연동 및 캐시 CRUD 검증](#step-8-elasticache-redis-클러스터-연동-및-캐시-crud-검증)
   - [Step 9 & 10: IntelliJ IDEA를 통한 비공개 데이터 계층 SSH 터널링 연결](#step-9--10-intellij-idea를-통한-비공개-데이터-계층-ssh-터널링-연결)
   - [Step 11: 골든 AMI 생성 및 무상태 복제 인스턴스 기동](#step-11-골든-ami-생성-및-무상태-복제-인스턴스-기동)
   - [Step 12: Application Load Balancer(ALB) 구축 및 라운드로빈 분산 검증](#step-12-application-load-balanceralb-구축-및-라운드로빈-분산-검증)
   - [Step 13: 관리형 리소스 안전 삭제 가이드](#step-13-관리형-리소스-안전-삭제-가이드)
3. [실제 발생한 트러블슈팅 및 해결 과정](#3-실제-발생한-트러블슈팅-및-해결-과정)
4. [핵심 기술 면접 질문 & 모범 답변 (Q&A)](#4-핵심-기술-면접-질문--모범-답변-qa)

---

## 1. 핵심 개념 및 아키텍처 개요

### 1.1 인프라 진화: 단일 컨테이너에서 무상태(Stateless) 아키텍처까지
단일 EC2 인스턴스 안에서 웹 서버, WAS, DB를 모두 구동하는 방식은 확장성(Scalability)과 고가용성(High Availability)에 한계가 있습니다.
* **상태 분리 (State Decoupling):** 트랜잭션 데이터(MySQL)와 세션/캐시(Redis), 정적 파일(S3)을 EC2 외부의 관리형 서비스로 분리하여 EC2를 **무상태(Stateless) 노드**로 전환합니다.
* **수평 확장 (Scale-Out):** 상태가 제거된 EC2는 언제든지 골든 AMI를 통해 동일한 스펙의 노드로 복제 및 증설이 가능합니다.
* **장애 격리 (Fault Isolation):** 특정 EC2 노드에 장애가 발생해도 로드밸런서(ALB)가 헬스 체크를 통해 트래픽을 정상 노드로만 라우팅합니다.

### 1.2 트래픽 처리 계층의 역할 분담
```text
[클라이언트 요청] 
       │
       ▼ (HTTP:80)
[Application Load Balancer (ALB)] : L7 라운드로빈 분산, 헬스 체크, 단일 DNS 진입점
       │
   ┌───┴────────────────┐
   ▼ (HTTP:80)          ▼ (HTTP:80)
[Node 1 (EC2)]        [Node 2 (EC2)] : L4 TCP NAT (Docker 포트 포워딩 80 -> 80)
   │                    │
[Nginx 리버스 프록시]  [Nginx 리버스 프록시] : L7 프록시, 원본 IP 헤더 보존, 백엔드 포트 은닉
   │                    │
   ▼ (HTTP:8080)        ▼ (HTTP:8080)
[Spring Boot WAS]     [Spring Boot WAS]
   │                    │
   └──────────┬─────────┘
              │ (JDBC:3306 / RESP:6379 / HTTPS)
              ▼
   [관리형 데이터 계층 (VPC 사설망)]
   - Amazon RDS MySQL (영속 트랜잭션 데이터)
   - Amazon ElastiCache Redis (인메모리 캐시 / 분산 세션)
   - Amazon S3 (정적 객체 스토리지, Presigned URL)
```

---

## 2. 전체 실습 절차 및 상세 코드 해설

### Step 0: 환경 변수 세팅 및 인증
리소스 이름의 충돌을 방지하고 소유자를 명확히 추적하기 위해 모든 자원에 식별자(`STUDENT_ID`)를 접두어로 부여합니다.

```bash
export STUDENT_ID="student08"
export AWS_PROFILE="$STUDENT_ID"
export AWS_REGION="ap-northeast-2"
export AWS_PAGER=""

export MY_KEY_NAME="${STUDENT_ID}-key"
export MY_SG_NAME="${STUDENT_ID}-web-sg"
export MY_INSTANCE_NAME="${STUDENT_ID}-managed-ec2"
export MY_INSTANCE_NAME_2="${MY_INSTANCE_NAME}-2"
export MY_DATA_SG_NAME="${STUDENT_ID}-data-sg"
export MY_DB_ID="${STUDENT_ID}-mysql-db"
export MY_DB_SUBNET_GROUP="${STUDENT_ID}-db-subnet-group"
export MY_CACHE_ID="${STUDENT_ID}-redis"
export MY_CACHE_SUBNET_GROUP="${STUDENT_ID}-cache-subnet-group"
export MY_AMI_NAME="${STUDENT_ID}-app-image"
export MY_TG_NAME="${STUDENT_ID}-app-tg"
export MY_ALB_SG_NAME="${STUDENT_ID}-alb-sg"
export MY_ALB_NAME="${STUDENT_ID}-app-alb"
export MY_APP_IMAGE="ghcr.io/a1l1ke/simple-back-ghcr:latest"

# AWS 계정 ID 조회 및 고유 S3 버킷 이름 조합
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export MY_BUCKET="${STUDENT_ID}-app-assets-${ACCOUNT_ID}"
```

---

### Step 1: EC2 컴퓨팅 노드 및 웹 보안 그룹 생성
EC2 인스턴스 생성 전, SSH 접속용 키 페어와 기본 웹 보안 그룹을 생성합니다.

```bash
# 1. 키 페어 생성 및 개인키 파일 권한 제한 (POSIX 400: 소유자 읽기 전용)
rm -f ./"$MY_KEY_NAME".pem
aws ec2 delete-key-pair --key-name "$MY_KEY_NAME" 2>/dev/null || true
aws ec2 create-key-pair --key-name "$MY_KEY_NAME" \
    --tag-specifications "ResourceType=key-pair,Tags=[{Key=Name,Value=$MY_KEY_NAME},{Key=Course,Value=infra-training},{Key=Owner,Value=$STUDENT_ID}]" \
    --query "KeyMaterial" --output text > ./"$MY_KEY_NAME".pem
chmod 400 ./"$MY_KEY_NAME".pem

# 2. 기본 VPC 조회 및 EC2 웹 보안 그룹 생성
export VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query "Vpcs[0].VpcId" --output text)
export MY_SG_ID=$(aws ec2 create-security-group --group-name "$MY_SG_NAME" \
    --description "Web access for managed EC2" --vpc-id "$VPC_ID" \
    --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$MY_SG_NAME},{Key=Course,Value=infra-training},{Key=Owner,Value=$STUDENT_ID}]" \
    --query "GroupId" --output text)

# 3. 내 공인 IP 확인 후 SSH(22) 및 HTTP(80) 인바운드 허용
export MY_IP=$(curl -fsS https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress --group-id "$MY_SG_ID" --protocol tcp --port 22 --cidr "$MY_IP/32"
aws ec2 authorize-security-group-ingress --group-id "$MY_SG_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0

# 4. AWS SSM Parameter Store에서 Canonical Ubuntu ARM64 최신 AMI ID 조회 및 인스턴스 실행
export BASE_AMI_ID=$(aws ssm get-parameter \
    --name "/aws/service/canonical/ubuntu/server/24.04/stable/current/arm64/hvm/ebs-gp3/ami-id" \
    --query "Parameter.Value" --output text)

export INSTANCE_ID=$(aws ec2 run-instances \
    --image-id "$BASE_AMI_ID" --instance-type t4g.small \
    --key-name "$MY_KEY_NAME" --security-group-ids "$MY_SG_ID" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$MY_INSTANCE_NAME},{Key=Course,Value=infra-training},{Key=Owner,Value=$STUDENT_ID}]" \
    --query "Instances[0].InstanceId" --output text)

# 인스턴스 초기 기동 및 상태 검사(2/2 Passed) 완료 대기
aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
aws ec2 wait instance-status-ok --instance-ids "$INSTANCE_ID"

export PUBLIC_IP=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID" \
    --query "Reservations[0].Instances[0].PublicIpAddress" --output text)
echo "1번 EC2 공인 IP: $PUBLIC_IP"
```

---

### Step 2: Docker 런타임 설치 및 컨테이너 이미지 사전 확보
EC2에 SSH로 접속하여 컨테이너 런타임(Docker, Docker Compose)을 설치하고 배포할 이미지를 미리 pull 받습니다.

```bash
ssh -i ./"$MY_KEY_NAME".pem -o StrictHostKeyChecking=accept-new ubuntu@"$PUBLIC_IP" bash -s << 'EOF'
set -e
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl is-active docker
sudo docker --version
sudo docker compose version

# 실습에 필요한 이미지 사전 다운로드
sudo docker pull nginx:alpine
sudo docker pull ghcr.io/a1l1ke/simple-back-ghcr:latest
EOF
```

---

### Step 3: 데이터 계층 보안 그룹 및 Multi-AZ 서브넷 그룹 생성
데이터 계층(RDS, Redis)은 인터넷에 노출되면 안 되므로 **보안 그룹 체이닝(Security Group Chaining)**을 적용합니다.

```bash
# 1. 데이터 전용 보안 그룹 생성
export MY_DATA_SG_ID=$(aws ec2 create-security-group \
    --group-name "$MY_DATA_SG_NAME" \
    --description "RDS and ElastiCache access from EC2 SG" --vpc-id "$VPC_ID" \
    --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$MY_DATA_SG_NAME},{Key=Course,Value=infra-training},{Key=Owner,Value=$STUDENT_ID}]" \
    --query "GroupId" --output text)

# 2. CIDR 대신 EC2 보안 그룹($MY_SG_ID)을 소스로 지정하여 3306(MySQL), 6379(Redis) 허용
aws ec2 authorize-security-group-ingress --group-id "$MY_DATA_SG_ID" --protocol tcp --port 3306 --source-group "$MY_SG_ID"
aws ec2 authorize-security-group-ingress --group-id "$MY_DATA_SG_ID" --protocol tcp --port 6379 --source-group "$MY_SG_ID"

# 3. 다중 가용 영역(Multi-AZ) 서브넷 그룹 생성 (최소 2개 이상의 AZ 서브넷 필요)
export SUBNET_IDS=($(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[].SubnetId" --output text))

aws rds create-db-subnet-group \
    --db-subnet-group-name "$MY_DB_SUBNET_GROUP" \
    --db-subnet-group-description "Default VPC subnets for RDS" \
    --subnet-ids "${SUBNET_IDS[@]}"

aws elasticache create-cache-subnet-group \
    --cache-subnet-group-name "$MY_CACHE_SUBNET_GROUP" \
    --cache-subnet-group-description "Default VPC subnets for ElastiCache" \
    --subnet-ids "${SUBNET_IDS[@]}"
```

---

### Step 4: RDS MySQL & ElastiCache Redis 비동기 프로비저닝
데이터베이스와 인메모리 캐시는 생성까지 5~10분이 소요되므로 비동기로 요청을 보낸 뒤 다음 작업을 진행합니다.

```bash
export MY_DB_PASSWORD="qwer1234!"

# 1. RDS MySQL 단일 인스턴스 비동기 프로비저닝 요청
aws rds create-db-instance \
    --db-instance-identifier "$MY_DB_ID" \
    --db-instance-class db.t4g.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password "$MY_DB_PASSWORD" \
    --allocated-storage 20 \
    --storage-type gp3 \
    --vpc-security-group-ids "$MY_DATA_SG_ID" \
    --db-subnet-group-name "$MY_DB_SUBNET_GROUP" \
    --no-multi-az \
    --no-publicly-accessible \
    --backup-retention-period 0 \
    --tags Key=Name,Value="$MY_DB_ID" Key=Course,Value=infra-training Key=Owner,Value="$STUDENT_ID"

# 2. ElastiCache Redis 단일 노드 클러스터 생성 요청
aws elasticache create-cache-cluster \
    --cache-cluster-id "$MY_CACHE_ID" \
    --cache-node-type cache.t4g.micro \
    --engine redis \
    --num-cache-nodes 1 \
    --cache-subnet-group-name "$MY_CACHE_SUBNET_GROUP" \
    --security-group-ids "$MY_DATA_SG_ID" \
    --tags Key=Name,Value="$MY_CACHE_ID" Key=Course,Value=infra-training Key=Owner,Value="$STUDENT_ID"
```

---

### Step 5: Amazon S3 버킷 생성 및 Presigned URL 검증
정적 객체를 안전하게 보관하고 서명된 임시 URL로만 접근할 수 있는 보안 구조를 검증합니다.

```bash
# 1. 고유한 S3 버킷 생성 및 태깅
aws s3 mb "s3://$MY_BUCKET" --region "$AWS_REGION"
aws s3api put-bucket-tagging --bucket "$MY_BUCKET" \
    --tagging "TagSet=[{Key=Name,Value=$MY_BUCKET},{Key=Course,Value=infra-training},{Key=Owner,Value=$STUDENT_ID}]"

# 2. 테스트 객체 업로드
echo "Hello from Amazon S3 Managed Storage!" > hello.txt
aws s3 cp hello.txt "s3://$MY_BUCKET/hello.txt"

# 3. 300초(5분) 만료 Presigned URL 발급 및 다운로드 테스트
export PRESIGNED_URL=$(aws s3 presign "s3://$MY_BUCKET/hello.txt" --expires-in 300)
echo "발급된 Presigned URL: $PRESIGNED_URL"

# 서명된 URL 호출 -> HTTP 200 OK
curl -i -s "$PRESIGNED_URL"

# 서명 없는 직접 호출 -> HTTP 403 Forbidden 차단 확인
curl -i -s "https://${MY_BUCKET}.s3.${AWS_REGION}.amazonaws.com/hello.txt" | head -1
```

---

### Step 6: RDS 및 ElastiCache 프로비저닝 완료 대기 및 FQDN 확보
RDS와 Redis가 완전히 준비될 때까지 대기한 후 FQDN(도메인 주소)을 획득합니다.

```bash
# 1. RDS 가용 상태 대기 및 엔드포인트 조회
aws rds wait db-instance-available --db-instance-identifier "$MY_DB_ID"
export RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier "$MY_DB_ID" --query "DBInstances[0].Endpoint.Address" --output text)
export RDS_PORT=$(aws rds describe-db-instances --db-instance-identifier "$MY_DB_ID" --query "DBInstances[0].Endpoint.Port" --output text)
echo "확정된 RDS 엔드포인트: $RDS_ENDPOINT:$RDS_PORT"

# 2. ElastiCache 가용 상태 폴링 대기 (ElastiCache는 전용 CLI wait 명령어가 없으므로 15초 루프 폴링 수행)
echo "ElastiCache Redis 상태 폴링 시작..."
while [ "$(aws elasticache describe-cache-clusters --cache-cluster-id "$MY_CACHE_ID" --query "CacheClusters[0].CacheClusterStatus" --output text)" != "available" ]; do
    echo "현재 상태 대기 중... (15초 대기)"
    sleep 15
done
echo "ElastiCache Redis 프로비저닝 완료!"

export REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters --cache-cluster-id "$MY_CACHE_ID" --show-cache-node-info --query "CacheClusters[0].CacheNodes[0].Endpoint.Address" --output text)
export REDIS_PORT=$(aws elasticache describe-cache-clusters --cache-cluster-id "$MY_CACHE_ID" --show-cache-node-info --query "CacheClusters[0].CacheNodes[0].Endpoint.Port" --output text)
echo "확정된 ElastiCache 엔드포인트: $REDIS_ENDPOINT:$REDIS_PORT"
```

---

### Step 7: 3-Tier Docker Compose + RDS 연동 스택 구동
EC2 내부에서 로컬 MySQL 컨테이너를 배제하고 외부 AWS RDS로 접속하도록 `compose.yml` 및 환경 변수 파일(`.env.rds`)을 구성합니다.

#### 1. `.env.rds` 파일 작성
```properties
DB_NAME=appdb
DB_USER=admin
DB_PASSWORD=qwer1234!
RDS_ENDPOINT=student08-mysql-db.cx2g4k2i6q7n.ap-northeast-2.rds.amazonaws.com
APP_MESSAGE=Live on AWS EC2 Node 1 via Compose + RDS!
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_DATASOURCE_HIKARI_CONNECTIONTIMEOUT=30000
```

#### 2. `compose.yml` 구조 (RDS 연동 및 DB 자동생성 옵션 적용)
```yaml
name: aws-3-tier-rds

services:
  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    deploy:
      resources:
        limits:
          memory: 64M
    networks:
      - frontend-net

  app:
    image: ghcr.io/a1l1ke/simple-back-ghcr:latest
    container_name: spring-app
    restart: on-failure
    env_file:
      - .env.rds
    environment:
      PORT: 8080
      JAVA_TOOL_OPTIONS: "-XX:MaxRAMPercentage=75.0"
      SPRING_DATASOURCE_URL: "jdbc:mysql://${RDS_ENDPOINT}:3306/${DB_NAME}?createDatabaseIfNotExist=true"
      SPRING_DATASOURCE_USERNAME: ${DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
    deploy:
      resources:
        limits:
          memory: 896M
    networks:
      - frontend-net

networks:
  frontend-net:
```

```bash
# EC2 터미널에서 스택 기동 및 HTTP 200 검증
sudo docker compose --env-file .env.rds up -d --remove-orphans
curl -i http://localhost/
```

---

### Step 8: ElastiCache Redis 클러스터 연동 및 캐시 CRUD 검증
EC2 터미널에서 Redis CLI 도구를 설치하고 비공개 Redis 클러스터에 접속하여 캐시 생성/조회/삭제 테스트를 진행합니다.

```bash
sudo apt-get update -y && sudo apt-get install -y redis-tools

# Ping 테스트 -> PONG 응답
redis-cli -h student08-redis.38nsfo.0001.apn2.cache.amazonaws.com -p 6379 ping

# 데이터 등록 -> OK
redis-cli -h student08-redis.38nsfo.0001.apn2.cache.amazonaws.com -p 6379 set "student08:ec2" "connected-from-ec2"

# 데이터 조회 -> "connected-from-ec2"
redis-cli -h student08-redis.38nsfo.0001.apn2.cache.amazonaws.com -p 6379 get "student08:ec2"

# 데이터 삭제 -> (integer) 1
redis-cli -h student08-redis.38nsfo.0001.apn2.cache.amazonaws.com -p 6379 del "student08:ec2"
```

---

### Step 9 & 10: IntelliJ IDEA를 통한 비공개 데이터 계층 SSH 터널링 연결
사설 서브넷에 위치한 RDS와 ElastiCache는 공인 IP가 없으므로, 로컬 컴퓨터의 IntelliJ IDEA에서 EC2(퍼블릭 IP)를 **점프 호스트(Bastion Host)**로 삼아 SSH 터널링을 통해 연결합니다.

* **연결 구조:** 로컬 PC(IntelliJ) ➔ EC2 (Port 22, SSH 터널링) ➔ 사설망 RDS(3306) / Redis(6379)
* **IntelliJ Database 설정:**
  * **SSH Tunnel:** Host: `3.37.61.4`, User: `ubuntu`, Auth: Key Pair (`student08-key.pem`)
  * **MySQL:** Host: `student08-mysql-db...`, Port: `3306`, User: `admin`, DB: `appdb`
  * **Redis:** Host: `student08-redis...`, Port: `6379`
* **IntelliJ Console 실행 명령어:**
  ```sql
  -- MySQL Console
  SELECT DATABASE();
  SHOW TABLES;
  SELECT * FROM users;
  ```
  ```redis
  -- Redis Console
  SET student08:intellij "connected-via-ssh-tunnel"
  GET student08:intellij
  DEL student08:intellij
  ```

---

### Step 11: 골든 AMI 생성 및 무상태 복제 인스턴스 기동
현재 정상 동작 중인 1번 EC2 인스턴스의 디스크 상태를 그대로 굳혀 **골든 AMI(불변 이미지)**를 생성하고, 이를 기반으로 2번 인스턴스를 복제합니다.

```bash
# 1. 1번 인스턴스로부터 골든 AMI 생성 (--no-reboot 옵션으로 무중단 이미지 생성)
export AMI_ID=$(aws ec2 create-image \
    --instance-id "$INSTANCE_ID" \
    --name "${MY_AMI_NAME}-$(date +%s)" \
    --tag-specifications "ResourceType=image,Tags=[{Key=Name,Value=$MY_AMI_NAME},{Key=Course,Value=infra-training},{Key=Owner,Value=$STUDENT_ID}]" \
    --no-reboot \
    --query "ImageId" --output text)

echo "생성 중인 골든 AMI: $AMI_ID"
aws ec2 wait image-available --image-ids "$AMI_ID"
echo "골든 AMI 준비 완료: $AMI_ID"

# 2. 골든 AMI를 기반으로 2번 복제 인스턴스 기동
export INSTANCE_ID_2=$(aws ec2 run-instances \
    --image-id "$AMI_ID" \
    --instance-type t4g.small \
    --key-name "$MY_KEY_NAME" \
    --security-group-ids "$MY_SG_ID" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$MY_INSTANCE_NAME_2},{Key=Course,Value=infra-training},{Key=Owner,Value=$STUDENT_ID}]" \
    --query "Instances[0].InstanceId" --output text)

aws ec2 wait instance-running --instance-ids "$INSTANCE_ID_2"
aws ec2 wait instance-status-ok --instance-ids "$INSTANCE_ID_2"

export PUBLIC_IP_2=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID_2" \
    --query "Reservations[0].Instances[0].PublicIpAddress" --output text)
echo "2번 복제 인스턴스 IP: $PUBLIC_IP_2"
```

---

### Step 12: Application Load Balancer(ALB) 구축 및 라운드로빈 분산 검증
두 대의 EC2 인스턴스 앞단에 L7 로드밸런서(ALB)를 배치하여 단일 진입점(DNS)을 만들고 트래픽을 고르게 분산합니다.

```bash
# 1. ALB 전용 보안 그룹 생성 (HTTP 80 오픈)
export MY_ALB_SG_ID=$(aws ec2 create-security-group --group-name "$MY_ALB_SG_NAME" \
    --description "ALB security group" --vpc-id "$VPC_ID" \
    --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$MY_ALB_SG_NAME},{Key=Course,Value=infra-training},{Key=Owner,Value=$STUDENT_ID}]" \
    --query "GroupId" --output text)

aws ec2 authorize-security-group-ingress --group-id "$MY_ALB_SG_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0

# 2. 타겟 그룹 생성 및 1번, 2번 인스턴스 등록
export MY_TG_ARN=$(aws elbv2 create-target-group --name "$MY_TG_NAME" \
    --protocol HTTP --port 80 --vpc-id "$VPC_ID" \
    --target-type instance --health-check-path "/" \
    --tags Key=Name,Value="$MY_TG_NAME" Key=Course,Value=infra-training Key=Owner,Value="$STUDENT_ID" \
    --query "TargetGroups[0].TargetGroupArn" --output text)

aws elbv2 register-targets --target-group-arn "$MY_TG_ARN" --targets Id="$INSTANCE_ID" Id="$INSTANCE_ID_2"

# 3. ALB 생성 (기본 VPC의 서브넷들을 포함)
export SUBNET_IDS_LIST=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[].SubnetId" --output text)

export MY_ALB_ARN=$(aws elbv2 create-load-balancer --name "$MY_ALB_NAME" \
    --subnets $SUBNET_IDS_LIST --security-groups "$MY_ALB_SG_ID" \
    --tags Key=Name,Value="$MY_ALB_NAME" Key=Course,Value=infra-training Key=Owner,Value="$STUDENT_ID" \
    --query "LoadBalancers[0].LoadBalancerArn" --output text)

# 4. 80 포트 리스너 생성 (요청을 타겟 그룹으로 포워딩)
aws elbv2 create-listener --load-balancer-arn "$MY_ALB_ARN" --protocol HTTP --port 80 \
    --default-actions "Type=forward,TargetGroupArn=$MY_TG_ARN"

# 5. ALB DNS 주소 확인 및 라운드로빈 6회 호출 테스트
export ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns "$MY_ALB_ARN" --query "LoadBalancers[0].DNSName" --output text)
echo "ALB DNS: http://$ALB_DNS"

echo "=== ALB 라운드로빈 분산 테스트 (6회 호출) ==="
for i in {1..6}; do
    curl -s "http://$ALB_DNS/"
    echo ""
done
```

---

### Step 13: 관리형 리소스 안전 삭제 가이드
ElastiCache와 ALB는 `stop` 상태가 없어 켜져 있는 동안 계속 요금이 발생하므로 실습 완료 후 반드시 순서대로 삭제해야 합니다.

```bash
# 1. ALB 및 타겟 그룹 삭제
aws elbv2 delete-load-balancer --load-balancer-arn "$MY_ALB_ARN"
aws elbv2 wait load-balancers-deleted --load-balancer-arns "$MY_ALB_ARN"
aws elbv2 delete-target-group --target-group-arn "$MY_TG_ARN"

# 2. RDS MySQL 및 ElastiCache Redis 삭제
aws rds delete-db-instance --db-instance-identifier "$MY_DB_ID" --skip-final-snapshot --delete-automated-backups
aws elasticache delete-cache-cluster --cache-cluster-id "$MY_CACHE_ID"

# 3. S3 버킷 비우기 및 삭제
aws s3 rm "s3://$MY_BUCKET" --recursive
aws s3 rb "s3://$MY_BUCKET"

# 4. EC2 인스턴스 종료 (Terminate) 및 AMI/스냅샷 해제
aws ec2 terminate-instances --instance-ids "$INSTANCE_ID" "$INSTANCE_ID_2"
export AMI_SNAPSHOT_ID=$(aws ec2 describe-images --image-ids "$AMI_ID" --query 'Images[0].BlockDeviceMappings[0].Ebs.SnapshotId' --output text)
aws ec2 deregister-image --image-id "$AMI_ID"
aws ec2 delete-snapshot --snapshot-id "$AMI_SNAPSHOT_ID"
```

---

## 3. 실제 발생한 트러블슈팅 및 해결 과정

### 🚨 트러블슈팅 1: 줄바꿈(`\`) 뒤 공백 및 윈도우 CRLF(`\r`)로 인한 `ParameterNotFound`
* **문제 상황:** `aws ssm get-parameter` 실행 시 분명히 존재하는 경로임에도 `ParameterNotFound`가 발생함.
* **원인 분석:** Windows 터미널에서 여러 줄의 Bash 스크립트를 복사하는 과정에서 줄바꿈 문자 뒤에 보이지 않는 `\r`이 포함되어 파라미터 경로 뒤에 `/ami-id\r` 형태로 전송됨.
* **해결:** 줄바꿈(`\`)을 제거한 완전한 한 줄 명령어로 실행하거나 따옴표 처리를 명확히 하여 해결함.

### 🚨 트러블슈팅 2: `chmod 400` 읽기 전용 파일로 인한 리다이렉션 `Permission denied`
* **문제 상황:** 키 페어를 재생성할 때 `> ./"$MY_KEY_NAME".pem: Permission denied` 발생.
* **원인 분석:** 이전 단계에서 `chmod 400`으로 파일 권한을 '읽기 전용'으로 바꾸었기 때문에, Bash 리다이렉션(`>`)이 기존 파일을 덮어쓰지 못하고 차단됨.
* **해결:** 키 페어 생성 전 `rm -f ./"$MY_KEY_NAME".pem`으로 기존 파일을 먼저 삭제한 후 재생성함.

### 🚨 트러블슈팅 3: Compose `service "app" depends on undefined service "db"`
* **문제 상황:** `sudo docker compose --env-file .env.rds config` 실행 시 compose 파일 유효성 검사 실패.
* **원인 분석:** 외부 관리형 서비스인 AWS RDS를 사용하는 구조로 변경했음에도 `compose.yml` 내에 `depends_on: - db` 항목과 로컬 환경 변수 `${MYSQL_DATABASE}`가 그대로 남아있었음.
* **해결:** `compose.yml`에서 `depends_on: - db`를 제거하고, 환경 변수를 `.env.rds`의 변수명(`RDS_ENDPOINT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`)으로 일치시킴.

### 🚨 트러블슈팅 4: `Unknown database 'appdb'`로 인한 Nginx 502 Bad Gateway
* **문제 상황:** Docker Compose 구동 후 웹 접속 시 `502 Bad Gateway`가 출력되며 스프링부트 컨테이너가 무한 재시작됨.
* **원인 분석:** `aws rds create-db-instance` 명령 시 `--db-name` 옵션을 주지 않아 RDS MySQL 내부에 초기 데이터베이스(`appdb`) 스키마가 생성되지 않았고, 스프링부트의 HikariCP가 DB 연결에 실패함.
* **해결:** `compose.yml`의 JDBC URL에 `?createDatabaseIfNotExist=true` 옵션을 추가하여 스프링부트 초기 구동 시 `appdb` 데이터베이스가 없으면 자동으로 생성하도록 구성함.

---

## 4. 핵심 기술 면접 질문 & 모범 답변 (Q&A)

### Q1. RDS 사설 연결: `--no-publicly-accessible` 상태에서도 EC2 연결이 가능한 이유는 무엇인가?
> **답변:**  
> `--no-publicly-accessible` 옵션은 RDS 인스턴스에 공인 IP 할당을 차단하고 인터넷 게이트웨이(IGW)를 통한 직접적인 외부 접근 경로를 제거합니다. 그러나 동일한 VPC 내부의 사설 서브넷에 위치하므로, 동일 VPC 내의 EC2는 사설 IP(Private IP) 및 VPC 라우팅 테이블을 통해 직접 통신할 수 있으며, 3306 포트를 허용한 보안 그룹 규칙을 통해 안전하게 접근합니다.

### Q2. 보안 그룹 체이닝: CIDR 대신 보안 그룹을 소스로 지정하면 무엇이 개선되는가?
> **답변:**  
> CIDR(예: `172.31.0.0/16`)을 사용하면 서브넷 내의 불필요한 다른 호스트까지 허용 범위에 포함될 수 있고, IP가 변경될 때마다 방화벽 규칙을 수정해야 합니다. 반면 **보안 그룹 체이닝(Security Group Chaining)**을 적용하면 소스 보안 그룹 ID(예: `$MY_SG_ID`)를 가진 EC2 인스턴스만 접근하도록 제한할 수 있습니다. Auto Scaling으로 인스턴스 수가 유동적으로 증감하거나 사설 IP가 변경되더라도 보안 규칙을 수정할 필요가 없어 **역할 기반의 최소 권한 원칙**을 엄격히 유지할 수 있습니다.

### Q3. ElastiCache 수명주기: RDS와 달리 `stop` 상태가 없는 이유는 무엇인가?
> **답변:**  
> RDS는 디스크(EBS 볼륨) 기반 RDBMS이므로 컴퓨팅 인스턴스만 일시 중지(`stop`)시키고 스토리지에 데이터를 보존할 수 있습니다. 반면 ElastiCache(Redis)는 **인메모리(RAM) 기반 캐시**이므로 노드를 중지하면 메모리 상태와 데이터 보존을 분리하기 어렵습니다. 따라서 AWS ElastiCache는 활성 상태를 유지하거나 완전히 삭제(`delete`)하는 수명주기만 제공하며, 유휴 상태에서도 노드 시간당 비용이 발생합니다.

### Q4. S3 접근 제어: 버킷 전체 공개보다 Presigned URL이 안전한 이유는 무엇인가?
> **답변:**  
> S3 버킷을 Public으로 개방하면 권한 없는 모든 사용자에게 무제한 접근이 허용되어 데이터 유출 및 트래픽 과금 위험이 발생합니다. **Presigned URL**은 IAM 사용자/역할의 보안 자격 증명(SigV4)을 바탕으로 **특정 객체(Key), 특정 HTTP 메서드(GET/PUT), 제한된 유효 시간(Expire Time)**에만 접근할 수 있는 암호화된 임시 서명을 부여하므로, 버킷을 완벽히 비공개(Private)로 유지하면서 안전하게 다운로드/업로드 권한을 위임할 수 있습니다.

### Q5. ALB 헬스체크: 비정상 대상을 어떻게 감지하고 트래픽에서 격리하는가?
> **답변:**  
> ALB는 대상 그룹(Target Group)에 등록된 인스턴스들의 지정된 헬스 체크 경로(예: `/`)로 주기적인 HTTP 요청을 전송합니다. 연속으로 응답 실패(임계치, 예: 2회 연속 실패)가 발생하면 해당 인스턴스를 즉시 비정상(`unhealthy`) 상태로 전환하고 라운드로빈 트래픽 분배 대상에서 제외합니다. 이후 인스턴스가 정상 응답(예: 5회 연속 성공)을 복구하면 자동으로 트래픽 풀에 재편입시킵니다.

### Q6. AMI 일관성: `--no-reboot` 옵션의 장점과 위험은 무엇인가?
> **답변:**  
> `--no-reboot` 옵션을 주면 인스턴스를 재부팅하지 않고 즉시 스냅샷을 생성하므로 운영 중인 서비스의 중단을 방지할 수 있는 장점이 있습니다. 그러나 파일 시스템 버퍼나 메모리에 남아 있는 미기록 데이터(Dirty Cache)가 디스크에 플러시(Flush)되지 않은 상태로 스냅샷이 찍힐 수 있어 파일 시스템 불일치(Crash-Consistent) 위험이 있습니다. 다만 애플리케이션의 상태가 외부 RDS/Redis로 완전히 분리된 무상태(Stateless) 서버의 경우 로컬 디스크 쓰기 작업이 거의 없으므로 위험이 매우 낮습니다.

### Q7. L4 vs L7: NLB와 ALB의 핵심 차이와 상황별 선택 기준은 무엇인가?
> **답변:**  
> * **NLB (L4):** 전송 계층(TCP/UDP)에서 패킷을 종단(Terminate)하지 않고 통과시키므로 초저지연(Microsecond 단위)과 초고속 대규모 트래픽 처리에 적합하며, 고정 IP(Elastic IP) 할당이 가능합니다. (게임 서버, 대규모 스트리밍 등)
> * **ALB (L7):** 애플리케이션 계층(HTTP/HTTPS)에서 TCP 연결을 종단하고 HTTP 헤더, URL 경로, 쿼리 스트링 등을 분석하여 라우팅할 수 있으며, 쿠키 기반 세션 고정(Sticky Session), 가중치 기반 트래픽 분산, 무중단 Blue/Green 배포가 필요한 웹/마이크로서비스(MSA) 환경에 적합합니다.

### Q8. Route 53 ALIAS 레코드: CNAME 대비 기술적·비용적 이점은 무엇인가?
> **답변:**  
> 표준 DNS 규격상 CNAME 레코드는 최상위 루트 도메인(Zone Apex, 예: `example.com`)에 적용할 수 없으며 서브도메인에만 사용 가능합니다. 또한 CNAME은 별칭 해석을 위해 추가적인 DNS 쿼리를 발생시킵니다. 반면 **Route 53 ALIAS 레코드**는 AWS 고유 확장 기능으로, 루트 도메인(Zone Apex)에서도 ALB, CloudFront 등의 AWS 리소스 FQDN을 가상 A 레코드로 직접 매핑할 수 있으며, Route 53 내부에서 직접 처리되므로 추가 DNS 쿼리 비용이 발생하지 않습니다.
