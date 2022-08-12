import { FormatFn } from "@formatjs/cli-lib";
import {
  ArgumentElement,
  DateElement,
  DateTimeSkeleton,
  isArgumentElement,
  isDateElement,
  isLiteralElement,
  isNumberElement,
  isPluralElement,
  isPoundElement,
  isSelectElement,
  isTagElement,
  isTimeElement,
  LiteralElement,
  MessageFormatElement,
  NumberElement,
  parse,
  PluralElement,
  SelectElement,
  Skeleton,
  SKELETON_TYPE,
  TagElement,
  TimeElement,
  TYPE,
} from "@formatjs/icu-messageformat-parser";
import { hoistSelectors } from "@formatjs/icu-messageformat-parser/manipulator";
import { NumberSkeletonToken } from "@formatjs/icu-skeleton-parser";

function printAST(
  ast: MessageFormatElement[],
  parent?: MessageFormatElement
): string {
  return doPrintAST(ast, false, parent);
}

function doPrintAST(
  ast: MessageFormatElement[],
  isInPlural: boolean,
  parent?: MessageFormatElement
): string {
  const printedNodes = ast.map((el) => {
    if (isLiteralElement(el)) {
      return printLiteralElement(el, isInPlural);
    }

    if (isArgumentElement(el)) {
      return printArgumentElement(el);
    }
    if (isDateElement(el) || isTimeElement(el) || isNumberElement(el)) {
      return printSimpleFormatElement(el);
    }

    if (isPluralElement(el)) {
      return printPluralElement(el, parent);
    }

    if (isSelectElement(el)) {
      return printSelectElement(el, parent);
    }

    if (isPoundElement(el)) {
      return "#";
    }
    if (isTagElement(el)) {
      return printTagElement(el, parent);
    }
  });

  return printedNodes.join("");
}

function printTagElement(
  el: TagElement,
  parent?: MessageFormatElement
): string {
  return `<${el.value}>${printAST(el.children, parent)}</${el.value}>`;
}

function printEscapedMessage(message: string): string {
  return message.replace(/([{}](?:.*[{}])?)/su, `'$1'`);
}

function printLiteralElement({ value }: LiteralElement, isInPlural: boolean) {
  const escaped = printEscapedMessage(value);
  return isInPlural ? escaped.replace("#", "'#'") : escaped;
}

function printArgumentElement({ value }: ArgumentElement) {
  return `{${value}}`;
}

function printSimpleFormatElement(
  el: DateElement | TimeElement | NumberElement
) {
  return `{${el.value}, ${TYPE[el.type]}${
    el.style ? `, ${printArgumentStyle(el.style)}` : ""
  }}`;
}

function printNumberSkeletonToken(token: NumberSkeletonToken): string {
  const { stem, options } = token;
  return options.length === 0
    ? stem
    : `${stem}${options.map((o) => `/${o}`).join("")}`;
}

function printArgumentStyle(style: string | Skeleton) {
  if (typeof style === "string") {
    return printEscapedMessage(style);
  } else if (style.type === SKELETON_TYPE.dateTime) {
    return `::${printDateTimeSkeleton(style)}`;
  } else {
    return `::${style.tokens.map(printNumberSkeletonToken).join(" ")}`;
  }
}

function printDateTimeSkeleton(style: DateTimeSkeleton): string {
  return style.pattern;
}

function printSelectElement(el: SelectElement, parent?: MessageFormatElement) {
  const msg = [
    el.value,
    "select",
    Object.keys(el.options)
      .map(
        (id) =>
          `\n ${parent?.type === TYPE.plural ? "  " : ""}${id} {${doPrintAST(
            el.options[id].value,
            false,
            el
          )}}`
      )
      .join(""),
  ].reduce(function (previousValue, currentValue) {
    return (
      previousValue +
      (currentValue.startsWith("\n") ? "," : ", ") +
      currentValue
    );
  });
  return `\n {${msg}}`;
}

function printPluralElement(el: PluralElement, parent?: MessageFormatElement) {
  const type = el.pluralType === "cardinal" ? "plural" : "selectordinal";
  const msg = [
    el.value,
    type,
    [
      el.offset ? `offset:${el.offset}` : "",
      ...Object.keys(el.options).map(
        (id) =>
          `\n ${parent?.type === TYPE.select ? "  " : ""}${id} {${doPrintAST(
            el.options[id].value,
            true,
            el
          )}}`
      ),
    ]
      .filter(Boolean)
      .join(""),
  ].reduce(function (previousValue, currentValue) {
    return (
      previousValue +
      (currentValue.startsWith("\n") ? "," : ", ") +
      currentValue
    );
  });
  return `\n  {${msg}}`;
}

export type JsonMessage = Record<
  string,
  {
    message: string;
    description?: string;
  }
>;

export const format: FormatFn<JsonMessage> = (msgs) => {
  const results: JsonMessage = {};
  for (const [id, msg] of Object.entries(msgs)) {
    var parsedMessage = printAST(
      hoistSelectors(parse(msg.defaultMessage!))
    ).trim();
    results[id] = {
      message: parsedMessage,
      description:
        typeof msg.description === "string"
          ? msg.description
          : JSON.stringify(msg.description),
    };
  }
  return results;
};
