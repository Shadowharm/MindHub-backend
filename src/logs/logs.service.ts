import LogModel from './log.model'

class LogsService {
  async saveLog (path, statusCode, error = null) {
    return LogModel.create({ path, statusCode, error })
  }

  async getAll (params) {
    const condition = params.onlyErrors ? { 'error': { $ne: null } } : {}
    return LogModel.find(condition)
  }
}

export default new LogsService()