import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
  // console.log('checkUser - user: ', user);

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;
    console.log('name: ', name);

    const data = {
      clerkUserId: user.id,
      name,
      imageUrl: user?.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    }

    console.log('checkUser - data: ', data);

    const newUser = await db.user.create({ data: data });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
