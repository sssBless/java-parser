import { exec } from "child_process";
import { resolve } from "path";

export function compileAndExecuteJava(
  javaFilePath: string,
  className: string,
  expression: string
): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const buildPath = resolve(__dirname, "../../build");
    const compileCommand = `javac -d ${buildPath} ${javaFilePath}`;
    const executeCommand = `java -cp ${buildPath} ${className} "${expression}"`;

    exec(compileCommand, (compileError, _, compileStderr) => {
      if (compileError) {
        return reject(compileStderr || compileError.message);
      }
      if (compileStderr) {
        return reject(compileStderr);
      }

      exec(executeCommand, (executeError, executeStdout, executeStderr) => {
        if (executeError) {
          return reject(executeStderr || executeError.message);
        }
        if (executeStderr) {
          return reject(executeStderr);
        }
        resolvePromise(executeStdout.trim());
      });
    });
  });
}
