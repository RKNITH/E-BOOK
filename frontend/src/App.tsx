import { Routes, Route } from "react-router-dom";
import { FC } from "react";
import Home from "./views/Home";
import SignUp from "./views/SignUp";
import Container from "./components/common/Container";
import Verify from "./views/Verify";
import NewUser from "./views/NewUser";
import { Toaster } from "react-hot-toast";
import Profile from "./views/Profile";
import UpdateProfile from "./views/UpdateProfile";
import Guest from "./routes/Guest";
import Private from "./routes/Private";
import NewBookForm from "./views/NewBookForm";
import UpdateBookForm from "./views/UpdateBookForm";
import NewAuthorRegistration from "./views/NewAuthorRegistration";
import UpdateAuthor from "./views/UpdateAuthor";
import Author from "./routes/Author";
import NotFound from "./views/NotFound";
import SingleBook from "./views/SingleBook";
import Cart from "./views/Cart";
import PaymentSuccess from "./views/PaymentSuccess";
import Orders from "./views/Orders";
import ReviewForm from "./views/ReviewForm";
import AuthorPage from "./views/AuthorPage";
import Library from "./views/Library";
import ReadingPage from "./views/ReadingPage";
import Search from "./views/Search";

interface Props {}

const App: FC<Props> = () => {
  return (
    <Container>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:slug" element={<SingleBook />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/author/:id" element={<AuthorPage />} />

        <Route element={<Private />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/library" element={<Library />} />
          <Route path="/read/:slug" element={<ReadingPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/new-user" element={<NewUser />} />
          <Route path="/rate/:bookId" element={<ReviewForm />} />
          <Route
            path="/author-registration"
            element={<NewAuthorRegistration />}
          />

          <Route element={<Author />}>
            <Route path="/update-author" element={<UpdateAuthor />} />
            <Route path="/create-new-book" element={<NewBookForm />} />
            <Route path="/update-book/:slug" element={<UpdateBookForm />} />
          </Route>
        </Route>

        <Route element={<Guest />}>
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </Container>
  );
};

export default App;
