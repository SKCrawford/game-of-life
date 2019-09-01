import chalk from 'chalk';

enum LogLevels {
  Error = 0,
  Warn = 1,
  Info = 2,
  Debug = 3,
}

export class Logger {
  private context: string;
  private level: number;

  constructor(context: string, level: LogLevels = LogLevels.Debug) {
    this.context = context;
    this.level = level;
  }

  public get prefix() {
    const timestamp = new Date().toISOString();
    return `[${timestamp}][${this.context}]`;
  }

  public debug(...args: any[]) {
    if (this.level >= LogLevels.Debug) {
      const msg = chalk.blue('DBG', this.prefix, ...args);
      console.debug(msg);
    }
  }

  public info(...args: any[]) {
    if (this.level >= LogLevels.Info) {
      const msg = chalk.green('INF', this.prefix, ...args)
      console.info(msg);
    }
  }

  public warn(...args: any[]) {
    if (this.level >= LogLevels.Warn) {
      const msg = chalk.yellow('WRN', this.prefix, ...args)
      console.warn(msg);
    }
  }

  public error(...args: any[]) {
    if (this.level >= LogLevels.Error) {
      const msg = chalk.red('ERR', this.prefix, ...args)
      console.error(msg);
    }
  }

  public grid<T>(grid: T[][]) {
    const toPrettyRow = (cell: T) => Boolean(cell) ? 'X' : 'O';
    grid.forEach(row => {
      const prettyrow = row.map(toPrettyRow);
      console.info(chalk.green(...prettyrow))
    })
  }
}
