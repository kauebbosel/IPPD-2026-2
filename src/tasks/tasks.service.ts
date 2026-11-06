import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

const FILE = 'data/tasks.json';

@Injectable()
export class TasksService {
  private async read(): Promise<Task[]> {
    try {
      return JSON.parse(await fs.readFile(FILE, 'utf-8'));
    } catch {
      return [];
    }
  }

  private async write(tasks: Task[]) {
    await fs.mkdir('data', { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(tasks, null, 2));
  }

  findAll() { return this.read(); }

  async findOne(id: string) {
    const t = (await this.read()).find(t => t.id === id);
    if (!t) throw new NotFoundException();
    return t;
  }

  async create(data: { title: string; done?: boolean }) {
    const tasks = await this.read();
    const task = { id: randomUUID(), title: data.title, done: data.done ?? false };
    tasks.push(task);
    await this.write(tasks);
    return task;
  }

  // PUT: substitui tudo
  async replace(id: string, data: { title: string; done: boolean }) {
    const tasks = await this.read();
    const i = tasks.findIndex(t => t.id === id);
    if (i < 0) throw new NotFoundException();
    tasks[i] = { id, title: data.title, done: data.done };
    await this.write(tasks);
    return tasks[i];
  }

  // PATCH: altera só o que veio
  async update(id: string, data: Partial<Omit<Task, 'id'>>) {
    const tasks = await this.read();
    const i = tasks.findIndex(t => t.id === id);
    if (i < 0) throw new NotFoundException();
    tasks[i] = { ...tasks[i], ...data };
    await this.write(tasks);
    return tasks[i];
  }

  async remove(id: string) {
    const tasks = await this.read();
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length === tasks.length) throw new NotFoundException();
    await this.write(filtered);
  }
}