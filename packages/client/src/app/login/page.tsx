"use client";

import React, { useEffect } from "react";
import { useLoginCheck } from "@scspace-client/APIs/auth/useLoginCheck";
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";
import { randomBytes, createHash } from "crypto";
import axios from "axios";

const LoginPage: React.FC = () => {
  const { linkPush } = useLinkPush();
  const { isLogined } = useLoginCheck();

  function randomString() {
    const rnd = randomBytes(32).toString();
    const hash = createHash("sha256").update(rnd).digest("hex");
    return hash;
  }

  useEffect(() => {
    if (isLogined) {
      alert("이미 로그인 되어 있습니다.");
      linkPush("/");
      return;
    }

    const client_id = "kaist-scs";
    const server_url = "https://sso.kaist.ac.kr/auth/user/single/login/authorize";
    const redirect_uri = "https://scspace.kws.sparcs.net/api/auth/login";
    const state = randomString();
    const nonce = randomString();
    
    const data = {
      client_id: client_id,
      redirect_uri: redirect_uri,
      state: state,
      nonce: nonce,
    };

    const params = new URLSearchParams(data).toString();

    axios.post(server_url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then((res) => {
      alert(res);
    }).catch((err) => {
      alert("ERROR: " + String(err));
    });

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = server_url;

    // input 요소들 생성 및 추가
    const inputClientId = document.createElement('input');
    inputClientId.type = 'hidden';
    inputClientId.name = 'client_id';
    inputClientId.value = client_id;
    form.appendChild(inputClientId);

    const inputRedirectUri = document.createElement('input');
    inputRedirectUri.type = 'hidden';
    inputRedirectUri.name = 'redirect_uri';
    inputRedirectUri.value = redirect_uri;
    form.appendChild(inputRedirectUri);

    const inputState = document.createElement('input');
    inputState.type = 'hidden';
    inputState.name = 'state';
    inputState.value = state;
    form.appendChild(inputState);

    const inputNonce = document.createElement('input');
    inputNonce.type = 'hidden';
    inputNonce.name = 'nonce';
    inputNonce.value = nonce;
    form.appendChild(inputNonce);

    // // 폼을 body에 추가하고 submit
    document.body.appendChild(form);
    console.log(form);
    form.submit();


  }, [isLogined, linkPush]);
  console.log("isLogined", isLogined);
  console.log("test");

  return (
    <div id="main">
      <div>잠시 기다리면 로그인 페이지로 넘어갑니다...</div>
    </div>
  );
};

export default LoginPage;
