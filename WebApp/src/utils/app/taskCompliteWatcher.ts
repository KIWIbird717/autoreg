import store from '../../store/store';
import type { ILogs } from '../../store/types';


type taskCompliteStatusType = 
  | 'success'
  | 'error'
  | false

/**
 * Utility that monitors retrieve `task_id` and watch taks in `Logs`
 * until this task will be complite.
 * 
 * Еhe main utility that monitors the execution of tasks asynchronously 
 * after a get request to the backend server
 * 
 * @param task_id task_id from celery response
 * 
 * @returns `Promise<'success' | 'error' | false>`
 */
const TaskCompliteWatcher = async (task_id: string): Promise<taskCompliteStatusType> => {
  return new Promise<taskCompliteStatusType>((resolve) => {
    const checkTaskStatus = (logs: ILogs | null) => {
      const monitoringTask = logs?.list_logs.find((task) => task.task_id === task_id);

      switch (monitoringTask?.task_status) {
        case 'success':
          resolve('success');
          break;
        case 'error':
          resolve('error');
          break;
        default:
          break;
      }
    };

    // Subscribe to global storage updates
    store.subscribe(() => {
      const state = store.getState();  // initialize global storage
      const logs = state.app.logs;

      checkTaskStatus(logs)
    })
  })
};

export default TaskCompliteWatcher;