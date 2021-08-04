import {ConsoleLogger, LogLevel} from '@slack/logger'

const logger = new ConsoleLogger();
logger.setLevel(LogLevel.WARN);

export default logger;
