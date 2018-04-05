#!/usr/bin/env node

import { CLI, Shim } from 'clime';
import * as Path from 'path';

async function exec() {
  const cli = new CLI('blog', Path.join(__dirname, 'commands'));
  const shim = new Shim(cli);

  shim.execute(process.argv);
}

exec();
