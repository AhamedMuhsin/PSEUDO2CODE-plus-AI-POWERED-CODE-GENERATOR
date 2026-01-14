import re

def extract_for_condition(code: str):
    match = re.search(r"for\s*\(([^;]+);([^;]+);", code)
    return match.group(2).strip() if match else "for-condition"

def extract_while_condition(code: str):
    match = re.search(r"while\s*\(([^)]+)\)", code)
    return match.group(1).strip() if match else "while-condition"

def extract_all_if_conditions(code: str):
    return re.findall(r"if\s*\(([^)]+)\)", code)

def has_else_block(code: str):
    return bool(re.search(r"\belse\b", code))

def sanitize_label(text: str) -> str:
    """
    Make text safe for Mermaid labels
    """
    if not text:
        return ""

    return (
        text.replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("==", "=")
            .replace("!=", "≠")
            .replace("&&", "and")
            .replace("||", "or")
            .replace("%", "mod")
            .replace("(", "")
            .replace(")", "")
    )

def generate_mermaid_cfg(code: str) -> str:
    has_for = bool(re.search(r"\bfor\s*\(", code))
    has_while = bool(re.search(r"\bwhile\s*\(", code))
    if_conditions = extract_all_if_conditions(code)
    has_return = bool(re.search(r"\breturn\b", code))
    has_else = has_else_block(code)

    lines = [
        "flowchart TD",
        "Start([Start])"
    ]

    # 🔁 LOOP + IF
    if (has_for or has_while) and if_conditions:
        loop_cond = (
            extract_for_condition(code)
            if has_for
            else extract_while_condition(code)
        )

        lines += [
            f"LoopCond{{{loop_cond}}}",
            "LoopBody[Loop Body]"
        ]

        lines.append("Start --> LoopCond")
        lines.append("LoopCond -->|true| LoopBody")

        prev_node = "LoopBody"

        for idx, cond in enumerate(if_conditions):
            safe_cond = sanitize_label(cond)

            if_node = f"If{idx}{{{safe_cond}}}"
            then_node = f"Then{idx}[True]"
            else_node = f"Else{idx}[False]"
            merge_node = f"Merge{idx}[merge]"

            lines += [if_node, then_node, else_node, merge_node]

            lines.append(f"{prev_node} --> {if_node}")
            lines.append(f"{if_node} -->|true| {then_node}")
            lines.append(f"{then_node} --> {merge_node}")
            lines.append(f"{if_node} -->|false| {else_node}")
            lines.append(f"{else_node} --> {merge_node}")

            prev_node = merge_node


        lines.append(f"{prev_node} --> LoopCond")
        lines.append("LoopCond -->|false| Exit")

    # 🔀 MULTIPLE IFs (NO LOOP)
    elif len(if_conditions) > 1:
        prev_node = "Start"

        for idx, cond in enumerate(if_conditions):
            if_node = f"If{idx}{{{cond}}}"
            then_node = f"Then{idx}[True]"
            merge_node = f"Merge{idx}((merge))"

            lines += [if_node, then_node, merge_node]

            lines.append(f"{prev_node} --> {if_node}")
            lines.append(f"{if_node} -->|true| {then_node}")
            lines.append(f"{then_node} --> {merge_node}")

            if has_else:
                else_node = f"Else{idx}[False]"
                lines.append(f"{if_node} -->|false| {else_node}")
                lines.append(f"{else_node} --> {merge_node}")
            else:
                lines.append(f"{if_node} -->|false| {merge_node}")

            prev_node = merge_node

        lines.append(f"{prev_node} --> Exit")

    # ➖ SIMPLE FALLBACK
    else:
        lines.append("Start --> Process[Process Logic]")
        lines.append("Process --> Exit")

    # 🔚 END
    if has_return:
        lines.append("Exit --> Return[return]")
        lines.append("Return --> End([End])")
    else:
        lines.append("Exit --> End([End])")

    return "\n".join(lines)
