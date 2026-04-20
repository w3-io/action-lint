import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { runLint } from "../src/runner.js";
// Test against real action repos in the workspace
const WORKSPACE = resolve(import.meta.dirname, "../../..");
describe("runLint", () => {
    it("returns a valid report structure", () => {
        const report = runLint(resolve(WORKSPACE, "w3-venice-action"));
        assert.equal(report.version, "1.0.0");
        assert.ok(report.groups.length > 0);
        assert.equal(typeof report.passed, "number");
        assert.equal(typeof report.failed, "number");
        assert.equal(typeof report.skipped, "number");
        assert.equal(report.passed + report.failed + report.skipped, 36);
    });
    it("venice passes all deterministic checks", () => {
        const report = runLint(resolve(WORKSPACE, "w3-venice-action"));
        assert.equal(report.failed, 0, `Failures: ${report.groups
            .flatMap((g) => g.checks)
            .filter((c) => c.status === "fail")
            .map((c) => `${c.id}: ${c.label}${c.detail ? ` (${c.detail})` : ""}`)
            .join(", ")}`);
    });
    it("reports exactly 5 skipped checks", () => {
        const report = runLint(resolve(WORKSPACE, "w3-venice-action"));
        assert.equal(report.skipped, 5);
    });
    it("aave passes all deterministic checks", () => {
        const report = runLint(resolve(WORKSPACE, "w3-aave-action"));
        assert.equal(report.failed, 0, `Failures: ${report.groups
            .flatMap((g) => g.checks)
            .filter((c) => c.status === "fail")
            .map((c) => `${c.id}: ${c.label}`)
            .join(", ")}`);
    });
    it("stripe passes all deterministic checks", () => {
        const report = runLint(resolve(WORKSPACE, "w3-stripe-action"));
        assert.equal(report.failed, 0, `Failures: ${report.groups
            .flatMap((g) => g.checks)
            .filter((c) => c.status === "fail")
            .map((c) => `${c.id}: ${c.label}`)
            .join(", ")}`);
    });
    it("sxt passes all deterministic checks", () => {
        const report = runLint(resolve(WORKSPACE, "w3-sxt-action"));
        assert.equal(report.failed, 0, `Failures: ${report.groups
            .flatMap((g) => g.checks)
            .filter((c) => c.status === "fail")
            .map((c) => `${c.id}: ${c.label}`)
            .join(", ")}`);
    });
});
