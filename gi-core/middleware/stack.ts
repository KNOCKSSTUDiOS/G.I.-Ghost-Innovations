import { Middleware } from "./types";
import { HttpContext } from "../http/context";

export class MiddlewareStack {
  private stack: Middleware[] = [];

  use(mw: Middleware) {
    this.stack.push(mw);
  }

  async run(ctx: HttpContext, finalHandler: () => Promise<void>) {
    let index = -1;

    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) return;
      index = i;

      const fn = this.stack[i] || finalHandler;
      if (!fn) return;

      await fn(ctx, () => dispatch(i + 1));
    };

    await dispatch(0);
  }
}

