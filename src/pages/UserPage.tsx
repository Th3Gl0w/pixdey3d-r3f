/* eslint-disable @typescript-eslint/no-explicit-any */
import "./UserPage.css";
import mysessions_svg from "../assets/mysession.svg";
import { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../database/supabaseClient";
import { NavLink, useParams } from "react-router-dom";
type TRoom = {
  id?: number;
  owner_id: string;
  model_id: string;
  room_name: string;
  updated_at: string;
};
export default function UserPage({ session }: { session: Session }) {
  const [roomInfo, setRoomInfo] = useState<TRoom[]>([]);
  const { id } = useParams<any>();
  const getRoomInfo = useCallback(async () => {
    if (session.user.id === id) {
      try {
        const { data, error } = await supabase
          .from("room")
          .select("*")
          .eq("owner_id", session.user.id);
        if (error) {
          throw error;
        }
        if (data) {
          setRoomInfo(data);
        }
      } catch (error: any) {
        alert(error.message);
      }
    }
  }, [session, id]);

  const deleteRoom = async (roomId: number) => {
    if (session.user.id === id) {
      try {
        const { error } = await supabase.from("room").delete().eq("id", roomId);
        if (error) {
          throw error;
        }
      } catch (error: any) {
        alert(error.message);
      } finally {
        setRoomInfo((rooms: TRoom[]) =>
          rooms.filter((room: TRoom) => room.id !== roomId)
        );
      }
    }
  };
  useEffect(() => {
    getRoomInfo();
  });
  return (
    <>
      <div className="my-session-screen">
        <div className="my-session-container">
          <div className="my-session-svg-container">
            <img
              src={mysessions_svg}
              style={{ margin: "45px auto 34px auto" }}
            />
          </div>
          <div className="my-session-item-container">
            {roomInfo &&
              roomInfo.map((room) => {
                return (
                  <div className="my-session-item" key={room.id}>
                    <img
                      className="my-session-thumbnail"
                      src={
                        "https://img.animalplanet.co.kr/news/2020/05/20/700/al43zzl8j3o72bkbux29.jpg"
                      }
                    />
                    <div className="my-session-item-right">
                      <div className="my-session-name">{room.room_name}</div>
                      <div className="my-session-description">
                        Model Name : {room.model_id.split("-").pop()}
                      </div>
                      <div className="my-session-description">
                        Last updated :{" "}
                        {new Date(room.updated_at).toDateString()}
                      </div>
                      <NavLink
                        to={`/room/${room.model_id}`}
                        className="button-my-session-view"
                      >
                        View session
                      </NavLink>
                      <button
                        onClick={() => deleteRoom(room.id as number)}
                        className="button-my-session-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
