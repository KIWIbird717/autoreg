import { Model, Schema, model, Document, ObjectId } from "mongoose"

interface IEntityLogs extends Document {
  _id: ObjectId,
  message: string
  type_message: string
  datetime: Date
}

interface IListLogs extends Document {
  _id?: ObjectId
  task_id: string
  task_status: string
  task_folder: string
  task_worker: string
  type_log: string
  entity_logs: IEntityLogs[]
  start_time: string
}

export interface ILogs extends Document {
  _id?: ObjectId
  mail: string
  list_logs: IListLogs[]
}


const entityLogsSchema = new Schema<IEntityLogs>({
  _id: Object,
  message: String,
  type_message: String,
  datetime: Date,
})

const listLogsSchema = new Schema<IListLogs>({
  task_id: String,
  task_status: String,
  task_folder: String,
  task_worker: String,
  type_log: String,
  entity_logs: [entityLogsSchema],
  start_time: String,
})

const logsSchema = new Schema<ILogs>({
  mail: String,
  list_logs: [listLogsSchema],
},
{ timestamps: false, collection: 'user_logs', versionKey: false })


interface ILogsModel extends Model<ILogs> {}

export const LogsShema: ILogsModel = model<ILogs>("LogsShema", logsSchema)