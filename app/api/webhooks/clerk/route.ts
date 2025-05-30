import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const evt = await verifyWebhook(req);

		// Do something with payload
		// For this guide, log payload to console
		const { id } = evt.data;
		const eventType = evt.type;
		console.log(eventType);

		if (eventType === "user.created") {
			const {
				id,
				email_addresses,
				last_name,
				first_name,
				username,
				image_url,
			} = evt.data;

			// create new user object
			const user = {
				clerkId: id,
				firstName: first_name!,
				lastName: last_name!,
				email: email_addresses[0].email_address,
				username: username!,
				photo: image_url,
			};

			// create user on db
			const newUser = await createUser(user);

			if (newUser) {
				const client = await clerkClient();
				await client.users.updateUserMetadata(id, {
					publicMetadata: {
						userId: newUser._id,
					},
				});
			}

			return NextResponse.json({ message: "OK", user: newUser });
		}

		if (eventType === "user.updated") {
			const { id, last_name, first_name, username, image_url } = evt.data;

			// create new user object
			const user = {
				firstName: first_name!,
				lastName: last_name!,
				username: username!,
				photo: image_url,
			};

			// create user on db
			const updateuser = await updateUser(id, user);

			return NextResponse.json({ message: "OK", user: updateuser });
		}

		if (eventType === "user.deleted") {
			const { id } = evt.data;

			// delete user on db
			const deleteuser = await deleteUser(id!);

			return NextResponse.json({ message: "OK", user: deleteuser });
		}
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error verifying webhook", { status: 400 });
	}
}
