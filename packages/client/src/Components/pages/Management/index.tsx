"use client"

import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageSelector, { IPage } from "../Layout/PageSelector";

export default function Management() {
  const { needManager } = useAuth();
  needManager();

  const pages: IPage[] = []

  return (
    <PageSelector
      pages={pages}
    />
  );
};