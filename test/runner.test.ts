import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { runLint } from "../src/runner.js";

// Hermetic fixture bundled in this repo. Asserts the runner walks a
// well-formed action repo end-to-end without depending on workspace
// siblings — the only test in this file guaranteed to run in CI.
//
// The compiled test lives at `dist/test/runner.test.js`, two levels
// below the repo root. The fixture lives at `test/fixtures/...` in
// source, NOT copied into dist (the build is tsc-only). Resolve from
// the compiled location back into the source tree.
const HERMETIC_FIXTURE = resolve(
  import.meta.dirname,
  "../../test/fixtures/minimal-action",
);

// Sibling tests against real action repos depend on the polyrepo
// layout described in w3-integrations/README.md. Each test gates on
// the presence of *its own* fixture so a partial workspace doesn't
// run a test against a missing path. CI has zero siblings and skips
// all of them; local dev has them all and runs the lot.
const WORKSPACE = resolve(import.meta.dirname, "../../..");
const has = (slug: string) => existsSync(resolve(WORKSPACE, slug));

describe("runLint — hermetic fixture (runs in CI)", () => {
  it("returns a valid report structure with the expected check count", () => {
    const report = runLint(HERMETIC_FIXTURE);
    assert.equal(report.version, "1.0.0");
    assert.ok(report.groups.length > 0);
    assert.equal(typeof report.passed, "number");
    assert.equal(typeof report.failed, "number");
    assert.equal(typeof report.skipped, "number");
    // Total checks the runner emits — change this number when adding
    // or removing checks so a future drop or duplicate surfaces here.
    assert.equal(report.passed + report.failed + report.skipped, 36);
  });

  it("every check has a well-formed shape (id, status, label)", () => {
    const report = runLint(HERMETIC_FIXTURE);
    const allChecks = report.groups.flatMap((g) => g.checks);
    assert.ok(allChecks.length > 0, "no checks ran at all");
    for (const c of allChecks) {
      assert.ok(typeof c.id === "string" && c.id.length > 0, `bad id: ${c.id}`);
      assert.ok(
        ["pass", "fail", "skip"].includes(c.status),
        `bad status: ${c.status} on ${c.id}`,
      );
      assert.ok(
        typeof c.label === "string" && c.label.length > 0,
        `bad label on ${c.id}`,
      );
    }
  });

  it("the fixture passes some checks (proves discovery works)", () => {
    const report = runLint(HERMETIC_FIXTURE);
    assert.ok(
      report.passed > 0,
      `expected some passes, got 0 — runner likely walked the wrong path`,
    );
  });
});

describe("runLint — sibling action repos (skipped in CI)", () => {
  it(
    "venice returns a valid report structure",
    { skip: !has("w3-venice-action") },
    () => {
      const report = runLint(resolve(WORKSPACE, "w3-venice-action"));
      assert.equal(report.version, "1.0.0");
      assert.ok(report.groups.length > 0);
      assert.equal(typeof report.passed, "number");
      assert.equal(typeof report.failed, "number");
      assert.equal(typeof report.skipped, "number");
      assert.equal(report.passed + report.failed + report.skipped, 36);
    },
  );

  it(
    "venice passes all deterministic checks",
    { skip: !has("w3-venice-action") },
    () => {
      const report = runLint(resolve(WORKSPACE, "w3-venice-action"));
      assert.equal(
        report.failed,
        0,
        `Failures: ${report.groups
          .flatMap((g) => g.checks)
          .filter((c) => c.status === "fail")
          .map((c) => `${c.id}: ${c.label}${c.detail ? ` (${c.detail})` : ""}`)
          .join(", ")}`,
      );
    },
  );

  it(
    "venice reports exactly 5 skipped checks",
    { skip: !has("w3-venice-action") },
    () => {
      const report = runLint(resolve(WORKSPACE, "w3-venice-action"));
      assert.equal(report.skipped, 5);
    },
  );

  it(
    "aave passes all deterministic checks",
    { skip: !has("w3-aave-action") },
    () => {
      const report = runLint(resolve(WORKSPACE, "w3-aave-action"));
      assert.equal(
        report.failed,
        0,
        `Failures: ${report.groups
          .flatMap((g) => g.checks)
          .filter((c) => c.status === "fail")
          .map((c) => `${c.id}: ${c.label}`)
          .join(", ")}`,
      );
    },
  );

  it(
    "stripe passes all deterministic checks",
    { skip: !has("w3-stripe-action") },
    () => {
      const report = runLint(resolve(WORKSPACE, "w3-stripe-action"));
      assert.equal(
        report.failed,
        0,
        `Failures: ${report.groups
          .flatMap((g) => g.checks)
          .filter((c) => c.status === "fail")
          .map((c) => `${c.id}: ${c.label}`)
          .join(", ")}`,
      );
    },
  );

  it(
    "sxt passes all deterministic checks",
    { skip: !has("w3-sxt-action") },
    () => {
      const report = runLint(resolve(WORKSPACE, "w3-sxt-action"));
      assert.equal(
        report.failed,
        0,
        `Failures: ${report.groups
          .flatMap((g) => g.checks)
          .filter((c) => c.status === "fail")
          .map((c) => `${c.id}: ${c.label}`)
          .join(", ")}`,
      );
    },
  );
});
