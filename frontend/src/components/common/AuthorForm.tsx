import { FC, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import RichEditor from "../rich-editor";
import { Button, Input } from "@nextui-org/react";
import { MdClose, MdOutlineAdd } from "react-icons/md";
import { z } from "zod";
import ErrorList from "./ErrorList";
import { parseError } from "../../utils/helper";

export interface AuthorInfo {
  name: string;
  about: string;
  socialLinks?: string[];
}

export interface InitialState extends AuthorInfo {
  id: string;
}

interface Props {
  btnTitle?: string;
  onSubmit(data: AuthorInfo): Promise<void>;
  initialState?: InitialState;
}

const newAuthorSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .trim()
    .min(3, "Invalid name"),
  about: z
    .string({
      required_error: "About is missing!",
      invalid_type_error: "Invalid about!",
    })
    .trim()
    .min(100, "Please write at least 100 characters about yourself!"),
  socialLinks: z
    .array(z.string().url("Social links can only be list of  valid URLs!"))
    .optional(),
});

const AuthorForm: FC<Props> = ({ initialState, btnTitle, onSubmit }) => {
  const [socialLinks, setSocialLinks] = useState([""]);
  const [about, setAbout] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: string[] | undefined;
  }>();
  const { profile } = useAuth();

  const addLinkFields = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  const removeLinkField = (index: number) => {
    const oldList = [...socialLinks];
    oldList.splice(index, 1);

    setSocialLinks(oldList);
  };

  const updateSocialLinks = (index: number, value: string) => {
    const oldList = [...socialLinks];
    oldList[index] = value;
    setSocialLinks(oldList);
  };

  const handleSubmit = async () => {
    try {
      setBusy(true);
      const links: string[] = [];

      socialLinks.forEach((link) => {
        if (link.trim()) links.push(link);
      });

      const data = {
        name: profile?.name,
        about,
        socialLinks: links,
      };

      const result = newAuthorSchema.safeParse(data);
      if (!result.success) {
        return setErrors(result.error.flatten().fieldErrors);
      }

      await onSubmit(result.data);
    } catch (error) {
      parseError(error);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (initialState) {
      setAbout(initialState.about);
      let links = [""];

      if (initialState.socialLinks?.length) {
        links = initialState.socialLinks;
      }

      setSocialLinks(links);
    }
  }, [initialState]);

  return (
    <div className="p-4 space-y-6">
      <p>
        Name: <span className="font-semibold text-lg">{profile?.name}</span>
      </p>

      <RichEditor
        onChange={setAbout}
        value={about}
        editable
        placeholder="Say who you are to your readers..."
        isInvalid={errors?.about ? true : false}
        errorMessage={<ErrorList errors={errors?.about} />}
      />

      <div className="space-y-4">
        <p className="text-sm font-semibold">Social Links:</p>

        <ErrorList errors={errors?.socialLinks} />

        {socialLinks.map((_, index) => {
          return (
            <div key={index} className="flex items-center space-x-4">
              <Input
                onChange={({ target }) =>
                  updateSocialLinks(index, target.value)
                }
                value={socialLinks[index]}
                placeholder="https://x.com/@something"
              />
              {socialLinks.length > 1 && (
                <Button
                  size="sm"
                  onClick={() => removeLinkField(index)}
                  isIconOnly
                >
                  <MdClose />
                </Button>
              )}
            </div>
          );
        })}

        <div className="flex justify-end">
          <Button size="sm" onClick={addLinkFields} isIconOnly>
            <MdOutlineAdd />
          </Button>
        </div>
      </div>

      <Button isLoading={busy} onClick={handleSubmit}>
        {btnTitle}
      </Button>
    </div>
  );
};

export default AuthorForm;
