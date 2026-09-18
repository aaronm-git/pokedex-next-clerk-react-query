import { describe, expect, it, vi } from "vitest";
import { createListNavigation } from "./navigation.svelte";

describe("createListNavigation", () => {
  it("starts at 0 and moves down and up within bounds", () => {
    const nav = createListNavigation({ length: () => 3 });
    expect(nav.index).toBe(0);
    nav.handle("down");
    expect(nav.index).toBe(1);
    nav.handle("up");
    expect(nav.index).toBe(0);
    nav.handle("up");
    expect(nav.index).toBe(0);
  });

  it("stops at the last item", () => {
    const nav = createListNavigation({ length: () => 2 });
    nav.handle("down");
    nav.handle("down");
    nav.handle("down");
    expect(nav.index).toBe(1);
  });

  it("calls onselect with the cursor when A is pressed", () => {
    const onselect = vi.fn();
    const nav = createListNavigation({ length: () => 3, onselect });
    nav.handle("down");
    nav.handle("a");
    expect(onselect).toHaveBeenCalledTimes(1);
    expect(onselect).toHaveBeenCalledWith(1);
  });

  it("calls onback when B is pressed", () => {
    const onback = vi.fn();
    const nav = createListNavigation({ length: () => 3, onback });
    nav.handle("b");
    expect(onback).toHaveBeenCalledTimes(1);
  });

  it("ignores left, right, start and select", () => {
    const onselect = vi.fn();
    const onback = vi.fn();
    const nav = createListNavigation({ length: () => 3, onselect, onback });
    nav.handle("down");
    for (const button of ["left", "right", "start", "select"] as const) {
      nav.handle(button);
    }
    expect(nav.index).toBe(1);
    expect(onselect).not.toHaveBeenCalled();
    expect(onback).not.toHaveBeenCalled();
  });

  it("clamps the cursor the moment the list shrinks", () => {
    let len = 5;
    const nav = createListNavigation({ length: () => len });
    nav.handle("down");
    nav.handle("down");
    expect(nav.index).toBe(2);
    len = 2;
    expect(nav.index).toBe(1);
    nav.handle("down");
    expect(nav.index).toBe(1);
  });

  it("reads 0 on an empty list and never selects from one", () => {
    const onselect = vi.fn();
    const nav = createListNavigation({ length: () => 0, onselect });
    expect(nav.index).toBe(0);
    nav.handle("down");
    expect(nav.index).toBe(0);
    nav.handle("a");
    nav.select(0);
    expect(onselect).not.toHaveBeenCalled();
  });

  it("accepts a cursor from outside, clamped", () => {
    const nav = createListNavigation({ length: () => 4 });
    nav.index = 2;
    expect(nav.index).toBe(2);
    nav.index = 99;
    expect(nav.index).toBe(3);
    nav.index = -5;
    expect(nav.index).toBe(0);
  });

  it("selects a given item, moving the cursor there first", () => {
    const onselect = vi.fn();
    const nav = createListNavigation({ length: () => 4, onselect });
    nav.select(3);
    expect(nav.index).toBe(3);
    expect(onselect).toHaveBeenCalledWith(3);
    nav.select();
    expect(onselect).toHaveBeenLastCalledWith(3);
    expect(onselect).toHaveBeenCalledTimes(2);
  });
});
