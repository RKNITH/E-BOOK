"use client";
import { ChangeEventHandler, FC, useEffect, useState } from "react";
import AutoGenInput, { AutoGenButton } from "./AutoGenInput";
import RichEditor from "./rich-editor";
import { faker } from "@faker-js/faker";
import PosterSelector from "./PosterSelector";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { MdAutoAwesome } from "react-icons/md";
import { z } from "zod";
import { testAction } from "../action";
import { useFormState } from "react-dom";

interface Props {}

interface book {
  title: string;
  author: string;
  publisher: string;
  cover?: File | string;
  content: {
    title: string;
    content: string;
  }[];
}

const bookSchema = z.object({
  title: z.string({ message: "Invalid title!" }).min(5),
  author: z.string({ message: "Invalid author!" }).min(3),
  publisher: z.string({ message: "Invalid publisher!" }).min(3),
  content: z.array(
    z.object({
      title: z.string({ message: "Invalid chapter!" }).min(3),
      content: z.string({ message: "Invalid chapter content!" }).min(3),
    })
  ),
});

function upperFirstLetter(val = "") {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

const generateRandomTitle = () => {
  // Define an array of title patterns
  const titlePatterns = [
    () => `${faker.word.adjective()} ${faker.word.noun()}`, // [Adjective] [Noun]
    () => `${faker.word.noun()} of ${faker.word.noun()}`, // [Noun] of [Noun]
    () => `The ${faker.word.noun()}'s ${faker.word.noun()}`, // The [Noun]'s [Noun]
    () => `${faker.word.verb()} ${faker.word.noun()}`, // [Verb] [Noun]
    () => `The ${faker.word.adjective()} ${faker.word.noun()}`, // The [Adjective] [Noun]
    () => `${faker.person.firstName()}'s ${faker.word.noun()}`, // [Proper Noun]'s [Noun]
  ];

  // Randomly select a pattern and generate a title
  const randomPattern =
    titlePatterns[Math.floor(Math.random() * titlePatterns.length)];
  return randomPattern();
};

const generateRandomAuthorName = () => {
  const randomIndex = Math.round(Math.random());
  const gender: ["male", "female"] = ["male", "female"];
  const sex = gender[randomIndex];
  return faker.person.fullName({ sex });
};

function generateRandomChapter() {
  // Define an array of chapter title patterns
  const chapterTitlePatterns = [
    () => `${faker.word.adjective()} ${faker.word.noun()}`, // [Adjective] [Noun]
    () => `${faker.word.verb()} ${faker.word.noun()}`, // [Verb] [Noun]
    () => `The ${faker.word.noun()}`, // The [Noun]
    () => `${faker.word.noun()} and ${faker.word.noun()}`, // [Noun] and [Noun]
    () => `The ${faker.word.noun()} of ${faker.word.noun()}`, // The [Noun] of [Noun]
    () => `${faker.word.noun()} in ${faker.location.city()}`, // [Noun] in [Place]
    () =>
      `A ${faker.word.noun()} of ${faker.word.adjective()} ${faker.word.noun()}`, // A [Noun] of [Adjective] [Noun]
  ];

  // Randomly select a pattern and generate a chapter title
  const randomPattern =
    chapterTitlePatterns[
      Math.floor(Math.random() * chapterTitlePatterns.length)
    ];
  return randomPattern();
}

const EpubGeneratorForm: FC<Props> = () => {
  const [state, formAction] = useFormState(testAction, "");
  const [commonBookContent, setCommonBookContent] = useState<{
    title: string;
    author: string;
    publisher: string;
    poster?: File;
  }>({
    title: "",
    author: "",
    publisher: "",
  });

  const [selectedPoster, setSelectedPoster] = useState("");

  const [bookContent, setBookContent] = useState<
    { title: string; content: string }[]
  >([]);

  const addNewChapter = (type: string) => () => {
    const newChapter = { title: "", content: "" };
    setBookContent([...bookContent, newChapter]);
  };

  const handleTitleGeneration = () => {
    const title = upperFirstLetter(generateRandomTitle());
    setCommonBookContent({ ...commonBookContent, title });
  };

  const handleAuthorNameGeneration = () => {
    setCommonBookContent({
      ...commonBookContent,
      author: generateRandomAuthorName(),
    });
  };

  const handlePublicationGeneration = () => {
    setCommonBookContent({
      ...commonBookContent,
      publisher: faker.company.name(),
    });
  };

  const generateParagraphs = (index: number) => {
    const data = [...bookContent];
    const paragraph = faker.lorem.paragraph();
    const content = `<p style="padding: 10px 0;">${paragraph}</p>`;

    if (!data[index].content) data[index].content = content;
    else data[index].content += content;
    setBookContent(data);
  };

  const addSubtitle = (index: number) => {
    const data = [...bookContent];
    const chapterName = faker.lorem.sentence({ min: 3, max: 5 });
    const content = `<h2>${chapterName}</h2>`;

    if (!data[index].content) data[index].content = content;
    else data[index].content += content;
    setBookContent(data);
  };

  const handleBookBodyGeneration = (index: number) => {
    const data = [...bookContent];

    data[index].title = upperFirstLetter(generateRandomChapter());

    setBookContent(data);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setCommonBookContent({ ...commonBookContent, [name]: value });
  };

  const handlePosterSelection: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const files = target.files;
    if (files) {
      const poster = files[0];
      setCommonBookContent({ ...commonBookContent, poster });
      setSelectedPoster(URL.createObjectURL(poster));
    }
  };

  const handleSubmit = () => {
    const data: book = {
      title: commonBookContent.title,
      author: commonBookContent.author,
      publisher: commonBookContent.publisher,
      content: bookContent,
    };

    const result = bookSchema.safeParse(data);
    if (!result.success) {
      return console.log(result.error.flatten().fieldErrors);
    }

    const formData = new FormData();
    const cover = commonBookContent.poster;

    if (cover) {
      formData.append("cover", cover);
    }

    const { author, content, publisher, title } = result.data;
    formData.append("author", author);
    formData.append("content", JSON.stringify(content));
    formData.append("publisher", publisher);
    formData.append("title", title);

    formAction(formData);
  };

  useEffect(() => {
    if (state) {
      // Create an anchor element and simulate a click to download the file
      const link = document.createElement("a");
      link.href = state;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [state]);

  return (
    <div className="relative min-h-screen">
      <h1 className="text-xl font-semibold mb-5">Generate EBook Using Epub</h1>
      <div className="space-y-10">
        <PosterSelector src={selectedPoster} onChange={handlePosterSelection} />
        <AutoGenInput
          name="title"
          onChange={handleChange}
          placeholder="Book Title..."
          value={commonBookContent.title}
          onMagic={handleTitleGeneration}
        />
        <AutoGenInput
          name="author"
          onChange={handleChange}
          placeholder="Author Name"
          value={commonBookContent.author}
          onMagic={handleAuthorNameGeneration}
        />
        <AutoGenInput
          name="publisher"
          onChange={handleChange}
          placeholder="Publisher"
          value={commonBookContent.publisher}
          onMagic={handlePublicationGeneration}
        />

        {bookContent.map((item, index) => {
          return (
            <Accordion
              defaultExpandedKeys={[`${bookContent.length - 1}`]}
              key={index}
            >
              <AccordionItem
                key={index}
                aria-label={`Chapter ${index + 1}: ${item.title}`}
                subtitle="Press to expand"
                title={`Chapter ${index + 1}: ${item.title}`}
                textValue={index + " content"}
              >
                <AutoGenInput
                  name={item.title}
                  onChange={() => {}}
                  placeholder="Chapter Name"
                  value={item.title}
                  onMagic={() => handleBookBodyGeneration(index)}
                />
                <div className="mt-10 flex items-center space-x-2 px-2">
                  <AutoGenButton onMagic={() => generateParagraphs(index)} />
                  <button
                    onClick={() => addSubtitle(index)}
                    className="hover:underline"
                  >
                    Add Subtitle
                  </button>
                </div>
                <div className="transition-all rounded-md shadow-md w-full space-x-2 p-2">
                  <RichEditor
                    editable
                    value={item.content}
                    className="space-x-4 max-h-96 overflow-y-auto"
                    placeholder="Chapter content..."
                    onChange={(value) => {
                      const data = [...bookContent];
                      data[index].content = value;
                      setBookContent(data);
                    }}
                  />
                </div>
              </AccordionItem>
            </Accordion>
          );
        })}

        <div className="flex items-center space-x-5">
          <button
            onClick={addNewChapter("chapter")}
            className="hover:underline"
          >
            Add New Chapter
          </button>
        </div>
      </div>

      <div className="py-5 text-right">
        <Button
          onClick={handleSubmit}
          radius="none"
          endContent={<MdAutoAwesome />}
          className=""
        >
          Generate Book
        </Button>
      </div>
    </div>
  );
};

export default EpubGeneratorForm;
