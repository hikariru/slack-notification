import {ConsoleLogger, LogLevel} from '@slack/logger'

export const Logger = new ConsoleLogger();
Logger.setLevel(LogLevel.WARN);
