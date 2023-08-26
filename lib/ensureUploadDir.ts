import { pathExists, mkdir } from "fs-extra";
import path from "path";

export default async function EnsureUploadDir() {
  const files_dir = path.join(process.cwd(), "files");
  const addons_dir = path.join(files_dir, "addons");
  const items_dir = path.join(files_dir, "items");
  if (!(await pathExists(files_dir))) {
    await mkdir(files_dir);
  }
  if (!(await pathExists(addons_dir))) {
    await mkdir(addons_dir);
  }
  if (!(await pathExists(items_dir))) {
    await mkdir(items_dir);
  }
}
