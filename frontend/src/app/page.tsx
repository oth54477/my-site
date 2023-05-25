"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Home() {
  interface apiDataType {
    id: number;
    name: string;
    created_time: string;
  }

  const [inputData, setInputData] = useState("");
  const [apiData, setApiData] = useState<apiDataType[]>([]);

  const getData = () => {
    axios
      .get("http://localhost:8080/visited")
      .then((Response) => setApiData(Response.data));
  };

  const input = useRef<any>(null);

  useEffect(() => {
    getData();
  }, []);

  const onChange = (value: string) => {
    setInputData(value);
  };

  const submitData = async () => {
    await axios
      .post("http://localhost:8080/visited", {
        name: inputData,
        created_time: String(new Date()),
      })
      .then(() => {
        setInputData("");
        input.current.value = "";
        getData();
      });
  };

  const deleteData = (data: apiDataType) => {
    axios.delete(`http://localhost:8080/visited/${data.id}`).then(() => {
      getData();
    });
  };
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>SSAFY 8기</p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>오태훈의 블로그</p>
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <h1>방명록을 남겨주세요</h1>
        <input
          type="text"
          ref={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.code === "Enter" && submitData()}
        />
        <section className={styles.names}>
          {apiData ? (
            apiData.map((data: apiDataType) => (
              <div key={data.id}>
                <span>{data.name}</span>
                <span onClick={() => deleteData(data)}>x</span>
              </div>
            ))
          ) : (
            <></>
          )}
        </section>
      </div>

      <div className={styles.grid}></div>
    </main>
  );
}
