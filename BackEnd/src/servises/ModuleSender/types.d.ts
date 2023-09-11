import { Document } from "mongoose";
import type { Schema } from "mongoose";

export interface IAnswer extends Document {
  prev: string,
  trigger: string[],
  message: string,
  count_answers: number,
  count_sent: number,
  count_blocked_users: number,
  count_active_users: number,
  count_total_users: number,
  answered_ids: string[],
}

export interface IMSCMessage extends Document {
  _id: Schema.Types.ObjectId,
  post_link: string,
  message: string,
  media: string[],
  type: 'replies' | 'message',
  used: number,
  status: 'enable' | 'disable',
  createdAt: Date,
  updatedAt: Date,
  answers: IAnswer[],
}

export interface IModuleSenderConfig extends Document {
  _id: Schema.Types.ObjectId,
  title: string,
  description: string,
  user_owner_mail: string,
  tg_bots: string[],
  tg_users: string[],
  chats: string[],
  shared_users: string[],
  status: 'created' | 'started' | 'pending' | 'stopped' | 'completed' | 'failure',
  loop_count: number,
  loop_count_max: number,
  time_each_loop: number,
  msg_per_user: number,
  total_msg_users: number,
  type_sender: 'message' | 'replay' | 'bot',
  type_target: 'chats' | 'pm',
  messages: IMSCMessage[],
  total_messages_sent: number,
  createdAt: Date,
  updatedAt: Date,
  msg_append: (msg: IMSCMessage) => void;
}