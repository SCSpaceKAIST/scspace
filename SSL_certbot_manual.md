# 1. DNS 설정 확인
	1.	도메인 scspace.kws.sparcs.net이 해당 서버의 공인 IP로 제대로 연결되어 있어야 합니다.
	2.	**80번 포트(HTTP)**가 서버 방화벽이나 클라우드 보안 설정에서 열려 있어야 Certbot이 도메인 검증(http-01) 과정을 진행할 수 있습니다.
	•	HTTPS(443)도 마찬가지로 열려 있어야 최종적으로 인증서 적용 후 접근이 가능합니다.

	Tip: ping scspace.kws.sparcs.net 했을 때, 해당 서버 IP가 뜨면 DNS 연결이 정상이라고 볼 수 있습니다.

# 2. Certbot 설치

우분투에서 certbot을 설치하는 가장 흔한 방법은 snap을 통해서 설치하는 것입니다.
(기존 apt-get 방식도 있지만, 최신 우분투라면 snap이 권장)

A) snapd가 설치되어 있는지 확인

```bash
sudo apt-get update
sudo apt-get install snapd
```

B) snapd 최신 버전으로 갱신

```bash
sudo snap install core
sudo snap refresh core
```

C) certbot 설치

```bash
sudo snap install --classic certbot
```

D) 이제 certbot 명령을 전역에서 쓸 수 있도록 링크를 만듭니다:

```bash
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

# 3. 인증서 발급

