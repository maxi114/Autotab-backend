export class Logger {
  constructor(context) {
    this.context = context;
    this.isServerContext = typeof window === "undefined";
    this.colors = {
      reset: "\x1b[0m",
      red: "\x1b[31m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      gray: "\x1b[90m",
      bold: "\x1b[1m",
      magenta: "\x1b[35m",
    };
  }

  shouldLog() {
    if (this.isServerContext) return true;
    return process.env.NODE_ENV === "development";
  }

  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const environment = this.isServerContext ? "[SERVER]" : "[CLIENT]";
    const prefix = `${timestamp} ${environment} ${this.context}:`;
    return { prefix, message, ...(data && { data }) };
  }

  colorize(color, text) {
    if (!this.isServerContext) return text;
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  formatLogLevel(level) {
    return `[${level.toUpperCase()}]`;
  }

  formatOutput({ prefix, message, data }) {
    const logParts = [prefix, message];
    if (data) {
      logParts.push("\n" + JSON.stringify(data, null, 2));
    }
    return logParts.join(" ");
  }

  info(message, data) {
    if (!this.shouldLog()) return;
    const formattedData = this.formatMessage("info", message, data);
    console.log(
      this.colorize("blue", this.formatLogLevel("info")) +
        this.formatOutput(formattedData)
    );
  }

  error(message, error, data) {
    if (!this.shouldLog()) return;
    const errorData =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
    const formattedData = this.formatMessage("error", message, {
      ...data,
      error: errorData,
    });
    console.error(
      this.colorize("red", this.colors.bold + this.formatLogLevel("error")) +
        this.formatOutput(formattedData)
    );
  }

  warn(message, data) {
    if (!this.shouldLog()) return;
    const formattedData = this.formatMessage("warn", message, data);
    console.warn(
      this.colorize("yellow", this.formatLogLevel("warn")) +
        this.formatOutput(formattedData)
    );
  }

  debug(message, data) {
    if (!this.shouldLog()) return;
    const formattedData = this.formatMessage("debug", message, data);
    console.debug(
      this.colorize("gray", this.formatLogLevel("debug")) +
        this.formatOutput(formattedData)
    );
  }

  action(message, data) {
    if (!this.shouldLog()) return;
    const formattedData = this.formatMessage("action", message, data);
    console.log(
      this.colorize("magenta", this.formatLogLevel("action")) +
        this.formatOutput(formattedData)
    );
  }
}
