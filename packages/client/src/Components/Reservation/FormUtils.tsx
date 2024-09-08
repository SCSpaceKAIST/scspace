import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface FormState {
  content: {
    teamMember: string[];
    [key: string]: any;
  };
  timeFrom: Date | null;
  timeTo: Date | null;
  memberlist: Record<string, string>;
}

const FormUtil: React.FC = () => {
  const [state, setState] = useState<FormState>({
    content: { teamMember: [] },
    timeFrom: null,
    timeTo: null,
    memberlist: {},
  });

  const router = useRouter();

  const getTeam = async () => {
    try {
      const res = await axios.get("/api/team/mine");
      return res.data;
    } catch (error) {
      console.error("Failed to fetch team:", error);
      throw error;
    }
  };

  const getMember = async (teamId: string) => {
    try {
      const res = await axios.get(`/api/team/id?id=${teamId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch members:", error);
      throw error;
    }
  };

  const checkSubmit = (): string | true => {
    if (state.content.teamMember.length === 0) {
      return "팀 멤버를 선택해주세요";
    }
    if (state.timeFrom && state.timeTo) {
      if (
        new Date(state.timeFrom).getTime() >= new Date(state.timeTo).getTime()
      ) {
        return "시작 시간과 종료 시간을 올바르게 선택해주세요";
      }
    } else {
      return "시작 시간과 종료 시간을 올바르게 선택해주세요";
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = checkSubmit();
    if (error === true) {
      try {
        const res = await sendReq(false, state); // Assuming reservation is false for create
        if (res.data.reserveId) {
          router.push({
            pathname: "/confirmation",
            query: { reserveId: res.data.reserveId },
          });
        }
      } catch (error) {
        console.error("Failed to submit form:", error);
      }
    } else {
      alert(error);
    }
  };

  const onMemberChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setState((prevState) => ({
      ...prevState,
      content: { ...prevState.content, teamMember: [value] },
    }));

    try {
      const res = await getMember(value);
      const memberlist: Record<string, string> = {};
      res.member.forEach((member: { name: string; id: string }) => {
        memberlist[member.name] = member.id;
      });
      setState((prevState) => ({ ...prevState, memberlist }));
    } catch (error) {
      console.error("Failed to fetch member list:", error);
    }
  };

  const onTimeChange = (what: keyof FormState, date: Date | null) => {
    setState((prevState) => ({ ...prevState, [what]: date }));
  };

  const onContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      content: { ...prevState.content, [name]: value },
    }));
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => {
      const updated = prevState.content[name].includes(value)
        ? prevState.content[name].filter((item: string) => item !== value)
        : [...prevState.content[name], value];

      return {
        ...prevState,
        content: { ...prevState.content, [name]: updated },
      };
    });
  };

  const sendReq = async (reservation: boolean, state: FormState) => {
    const mode = reservation ? "update" : "create";
    const url = `/api/reservation/${mode}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(url, JSON.stringify(state), config);
      return res;
    } catch (error) {
      console.error("Failed to send request:", error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render form elements here */}
      {/* Example: */}
      <input
        type="text"
        name="teamMember"
        onChange={onContentChange}
        value={state.content.teamMember.join(", ")}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormUtil;
