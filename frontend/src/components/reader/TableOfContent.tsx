import { Accordion, AccordionItem } from "@nextui-org/react";
import { FC } from "react";

type BookNavItem = { title: string; href: string };
export type BookNavList = {
  label: BookNavItem;
  subItems: BookNavItem[];
};

interface Props {
  data: BookNavList[];
  visible?: boolean;
  onClick(href: string): void;
}

const TableOfContent: FC<Props> = ({ visible, data, onClick }) => {
  return (
    <div
      style={{ right: visible ? "0" : "-100%" }}
      className="dark:bg-book-dark dark:text-book-dark transition-all md:w-96 w-3/4 bg-white h-screen overflow-y-scroll fixed z-50 top-0 right-0 flex flex-col space-y-3 p-3 shadow-md"
    >
      {data.map(({ label, subItems }) => {
        if (!subItems.length)
          return (
            <div key={label.title}>
              <p
                onClick={() => onClick(label.href)}
                className="py-2 text-large hover:underline cursor-pointer"
              >
                {label.title}
              </p>
            </div>
          );

        return (
          <Accordion key={label.title} title={label.title}>
            <AccordionItem title={label.title}>
              <div className="space-y-3">
                {subItems.map((item) => {
                  return (
                    <p
                      key={item.title}
                      onClick={() => onClick(item.href)}
                      className="pl-6 text-large hover:underline cursor-pointer"
                    >
                      {item.title}
                    </p>
                  );
                })}
              </div>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
};

export default TableOfContent;
