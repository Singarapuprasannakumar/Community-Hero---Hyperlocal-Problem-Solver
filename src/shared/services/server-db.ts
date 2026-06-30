import { connectToDatabase } from "./db-connection";
import { IssueModel } from "../models/issue.model";
import { Issue } from "../types/issue-types";

// Persistent MongoDB database connection on the server side
class ServerIssuesDb {
  async getAll(): Promise<Issue[]> {
    await connectToDatabase();
    const issues = await IssueModel.find({}).sort({ createdAt: -1 }).lean();
    return issues as unknown as Issue[];
  }

  async getById(id: string): Promise<Issue | undefined> {
    await connectToDatabase();
    const issue = await IssueModel.findOne({
      $or: [{ id }, { refNumber: id }]
    }).lean();
    return issue ? (issue as unknown as Issue) : undefined;
  }

  async create(issue: Issue): Promise<Issue> {
    await connectToDatabase();
    const existing = await IssueModel.findOne({ id: issue.id }).lean();
    if (existing) {
      return existing as unknown as Issue;
    }
    const created = await IssueModel.create(issue);
    return created.toObject() as unknown as Issue;
  }

  async update(id: string, updates: Partial<Issue>): Promise<Issue | undefined> {
    await connectToDatabase();
    const updated = await IssueModel.findOneAndUpdate(
      { id },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { new: true }
    ).lean();
    return updated ? (updated as unknown as Issue) : undefined;
  }

  async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    const res = await IssueModel.deleteOne({ id });
    return res.deletedCount > 0;
  }
}

export const serverIssuesDb = new ServerIssuesDb();
