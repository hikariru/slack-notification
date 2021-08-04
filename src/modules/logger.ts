import {ConsoleLogger, LogLevel} from '@slack/logger'

const Logger = new ConsoleLogger();
Logger.setLevel(LogLevel.WARN);

export default Logger;
