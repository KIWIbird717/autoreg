import mongoose from 'mongoose'

declare module 'mongoose' {
  interface IConnectOptions extends mongoose.ConnectOptions{
    useUnifiedTopology: boolean,
    useNewUrlParser: boolean
  }
}