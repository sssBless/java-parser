import { exec } from "child_process";
import { resolve } from "path";

export function executeJava(
  className: string,
  expression: string
): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const buildPath = resolve(__dirname, "../../build");
    const command = `java -cp ${buildPath} ${className} "${expression}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error.message);
      }
      if (stderr) {
        return reject(stderr);
      }
      resolvePromise(stdout.trim());
    });
  });
}
