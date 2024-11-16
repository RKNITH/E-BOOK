import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { Book } from "epubjs";
import { FC, useEffect, useState } from "react";

interface Props {
  book?: Book;
  notes?: string[];
  isOpen?: boolean;
  onClose?(): void;
  onNoteClick?(path: string): void;
}

const NotesModal: FC<Props> = ({
  book,
  notes,
  isOpen,
  onClose,
  onNoteClick,
}) => {
  const [data, setData] = useState<{ note: string; cfi: string }[]>([]);

  useEffect(() => {
    if (!notes || !book) return;

    const newNotes = Promise.all(
      notes.map(async (cfi) => {
        const note = (await book.getRange(cfi)).toString();
        return { note, cfi };
      })
    );

    newNotes.then(setData);
  }, [notes, book]);

  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex items-center justify-center">
          Notes & Highlights
        </ModalHeader>
        <ModalBody className="flex flex-col gap-6 items-center">
          {data.map((item) => {
            return (
              <Card key={item.cfi} className="max-w-2xl">
                <CardBody
                  className="cursor-pointer"
                  onClick={() => {
                    onNoteClick && onNoteClick(item.cfi);
                    onClose && onClose();
                  }}
                >
                  <p className="line-clamp-3">{item.note}</p>
                </CardBody>
              </Card>
            );
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NotesModal;
