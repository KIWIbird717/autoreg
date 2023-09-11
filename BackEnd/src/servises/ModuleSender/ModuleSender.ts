import mongoose, { Schema, model } from 'mongoose';
import type { IAnswer, IMSCMessage, IModuleSenderConfig } from './types';

const AnswersSchema = new Schema<IAnswer>({
  prev: { type: String, default: "" },
  trigger: { type: [String], default: [] },
  message: { type: String, default: "" },
  count_answers: { type: Number, default: 0 },
  count_sent: { type: Number, default: 0 },
  count_blocked_users: { type: Number, default: 0 },
  count_active_users: { type: Number, default: 0 },
  count_total_users: { type: Number, default: 0 },
  answered_ids: { type: [String], default: [] },
});

const MSCMessageSchema = new Schema<IMSCMessage>({
  post_link: { type: String, default: "t.me/..." },
  message: { type: String, default: "" },
  media: { type: [String], default: [] },
  type: { type: String, enum: ['replies', 'message'], default: "message" },
  used: { type: Number, default: 0 },
  status: { type: String, enum: ['enable', 'disable'], default: "enable" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  answers: { type: [AnswersSchema], default: [] }
});


const ModuleSenderConfigSchema = new Schema<IModuleSenderConfig>({
  title: { type: String, default: "Название проекта" },
  description: { type: String, default: "Описание проекта" },
  user_owner_mail: { type: String, default: "" },
  tg_bots: { type: [String], default: [] },
  tg_users: { type: [String], default: [] },
  chats: { type: [String], default: [] },
  shared_users: { type: [String], default: [] },
  status: { type: String, enum: ["created", "started", "pending", "stopped", "completed", "failure"], default: "created" },
  loop_count: { type: Number, default: 0 },
  loop_count_max: { type: Number, default: 0 },
  time_each_loop: { type: Number, default: 0 },
  msg_per_user: { type: Number, default: 0 },
  total_msg_users: { type: Number, default: 0 },
  type_sender: { type: String, enum: ["message", "replay", "bot"], default: "message" },
  type_target: { type: String, enum: ["chats", "pm"], default: "chats" },
  messages: { type: [MSCMessageSchema], default: [] },
  total_messages_sent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true, collection: 'modulesenderconfig', versionKey: false });

const ModuleSenderConfig = model<IModuleSenderConfig>('modulesenderconfig', ModuleSenderConfigSchema);

// Export the models
export { ModuleSenderConfig };