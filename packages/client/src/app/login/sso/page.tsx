"use client";

import React, { useEffect } from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { randomBytes, createHash } from "crypto";
import Scroll from "@scspace-client/Components/atoms/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";

const LoginPage: React.FC = () => {
  const { linkPush } = useLinkPush();
  const { isLogined } = useAuth();

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

    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID ?? "";
    const server_url = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
    const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI ?? "";
    // const state = randomString();
    const state = process.env.NEXT_PUBLIC_SSO_STATE3 ?? "";
    const nonce = randomString();

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

    // 폼을 body에 추가하고 submit
    document.body.appendChild(form);
    form.submit();

    // // For Dev
    // const form = document.createElement('form');
    // form.method = 'GET';
    // form.action = 'http://localhost:33001/api/auth/login';

    // document.body.appendChild(form);
    // console.log(form);
    // form.submit();

  }, [isLogined, linkPush]);
  console.log("isLogined", isLogined);
  console.log("test");

  return (
    <Scroll>
      <LoadingComponent />
    </Scroll>
  );
};

export default LoginPage;
