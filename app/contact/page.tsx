"use client";

import { Fragment, useEffect, useRef, useState, RefObject, FormEvent, ChangeEvent } from "react";

import { motion } from "motion/react";
import { FiCheckCircle } from "react-icons/fi";

import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";

import { ContactFormDataType, SummaryType, ContactFormQuestionType, CurLineType } from "@/types/types";

import { createClient } from "@/utils/supabase/client";

export default function Contact() {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();

        if (!error && data?.user) {
          setUser({
            name: "data.user.name",
            email: data.user.email!,
          });
        } else if (error) {
          console.error("Error fetching user:", error);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />
      <div
        ref={containerRef}
        onClick={() => {
          inputRef.current?.focus();
        }}
        className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36 shadow-xl cursor-text font-mono"
      >
        <TerminalHeader />
        <TerminalBody inputRef={inputRef} containerRef={containerRef} loading={loading} user={user} />
      </div>
      <Beams />
      <GradientGrid />
    </main>
  );
}

const TerminalHeader = () => {
  return (
    <div className="w-full p-3 bg-slate-900 flex items-center gap-1 sticky top-0">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="text-sm text-slate-200 font-semibold absolute left-[50%] -translate-x-[50%]">dyslecixdev@gmail.com</span>
    </div>
  );
};

const TerminalBody = ({
  containerRef,
  inputRef,
  loading,
  user,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  loading: boolean;
  user: { name: string; email: string } | null;
}) => {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");

  const [questions, setQuestions] = useState(QUESTIONS);

  const curQuestion = questions.find((q) => !q.complete);

  const handleSubmitLine = (value: string) => {
    if (curQuestion) {
      setQuestions((pv) =>
        pv.map((q) => {
          if (q.key === curQuestion.key) {
            return {
              ...q,
              complete: true,
              value,
            };
          }
          return q;
        })
      );
    }
  };

  return (
    <div className="w-full p-2 bg-zinc-900 text-slate-100 text-lg">
      <InitialText />
      <PreviousQuestions questions={questions} />
      <CurrentQuestion curQuestion={curQuestion} />
      {curQuestion ? (
        <CurLine
          text={text}
          focused={focused}
          setText={setText}
          setFocused={setFocused}
          inputRef={inputRef}
          command={curQuestion?.key || ""}
          handleSubmitLine={handleSubmitLine}
          containerRef={containerRef}
        />
      ) : (
        <Summary questions={questions} setQuestions={setQuestions} loading={loading} user={user} />
      )}
    </div>
  );
};

const InitialText = () => {
  return (
    <>
      <p>Hey there! We&apos;re excited to link 🔗</p>
      <p className="whitespace-nowrap overflow-hidden font-light">------------------------------------------------------------------------</p>
    </>
  );
};

const PreviousQuestions = ({ questions }: { questions: ContactFormQuestionType[] }) => {
  return (
    <>
      {questions.map((q, i) => {
        if (q.complete) {
          return (
            <Fragment key={i}>
              <p>
                {q.text || ""}
                {q.postfix && <span className="text-violet-300">{q.postfix}</span>}
              </p>
              <p className="text-emerald-300 break-words whitespace-normal overflow-wrap-anywhere">
                <FiCheckCircle className="inline-block mr-2" />
                <span>{q.value}</span>
              </p>
            </Fragment>
          );
        }
        return <Fragment key={i} />;
      })}
    </>
  );
};

const CurrentQuestion = ({ curQuestion }: { curQuestion: ContactFormQuestionType | undefined }) => {
  if (!curQuestion) return <></>;

  return (
    <p>
      {curQuestion.text || ""}
      {curQuestion.postfix && <span className="text-violet-300">{curQuestion.postfix}</span>}
    </p>
  );
};

const Summary = ({ questions, setQuestions, loading, user }: SummaryType) => {
  const [complete, setComplete] = useState(false);

  const handleReset = () => {
    setQuestions((pv) => pv.map((q) => ({ ...q, value: "", complete: false })));
  };

  const handleSend = () => {
    if (user === null) {
      console.error("User not logged in");
      return;
    }

    const formData = questions.reduce<ContactFormDataType>(
      (acc, val) => {
        return { ...acc, [val.key]: val.value };
      },
      { user: "", email: "" } as ContactFormDataType
    );

    formData.user = user.name;
    formData.email = user.email;

    // TODO send this as an email to dyslecixdev@gmail.com via sendgrid.
    console.log(formData);

    setComplete(true);
  };

  return (
    <>
      <p>Awesome! Here&apos;s your information:</p>
      <p>
        <span className="text-blue-300">user:</span> {user ? user.name : "error"}
      </p>
      <p>
        <span className="text-blue-300">email:</span> {user ? user.email : "error"}
      </p>
      {questions.map((q) => {
        return (
          <p key={q.key}>
            <span className="text-blue-300">{q.key}:</span>
            <span className="break-words whitespace-normal overflow-wrap-anywhere">{q.value}</span>
          </p>
        );
      })}
      <p>Is everything correct?</p>
      {complete ? (
        <p className="text-emerald-300">
          <FiCheckCircle className="inline-block mr-2" />
          <span>Sent! We&apos;ll get back to you ASAP 😎</span>
        </p>
      ) : (
        <div className="flex gap-2 mt-2">
          <button onClick={handleReset} className="px-3 py-1 text-base hover:opacity-90 transition-opacity rounded bg-slate-100 text-black cursor-pointer">
            Restart
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-3 py-1 text-base hover:opacity-90 transition-opacity rounded bg-indigo-500 text-white cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Send it!
          </button>
        </div>
      )}
    </>
  );
};

const CurLine = ({ text, focused, setText, setFocused, inputRef, command, handleSubmitLine, containerRef }: CurLineType) => {
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitLine(text);
    setText("");
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    scrollToBottom();
  };

  useEffect(() => {
    return () => setFocused(false);
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input ref={inputRef} onChange={onChange} value={text} type="text" className="sr-only" autoComplete="off" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      </form>
      <p>
        <span className="text-emerald-400">➜</span> <span className="text-cyan-300">~</span> {command && <span className="opacity-50">Enter {command}: </span>}
        {text}
        {focused && (
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
              times: [0, 0.5, 0.5, 1],
            }}
            className="inline-block w-2 h-5 bg-slate-400 translate-y-1 ml-0.5"
          />
        )}
      </p>
    </>
  );
};

const QUESTIONS = [
  {
    key: "question/suggestion",
    text: "Hello! Do you have a question or ",
    postfix: "suggestion to improve this website?",
    complete: false,
    value: "",
  },
];
