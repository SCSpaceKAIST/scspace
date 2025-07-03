"use client"

import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageSelector, { IPage } from "../templates/PageSelector";

export default function Manage() {
  const { needManager } = useAuth();
  needManager();

  const pages: IPage[] = []

  return (
    <PageSelector
      pages={pages}
    />
  );
};