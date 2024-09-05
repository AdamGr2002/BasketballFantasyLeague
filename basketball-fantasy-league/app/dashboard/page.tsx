import { currentUser } from "@clerk/nextjs/server"
import { UserButton } from '@clerk/nextjs'
import { WelcomeDashboard } from '../components/WelcomeDashboard'
import InteractiveCourtView from '../components/InteractiveCourtView'
import { api } from "../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

export default async function Dashboard() {
  const user = await currentUser()
  
  if (!user) {
    return <div>Loading...</div>
  }

  const ConvexDashboard = () => {
    const convexUser = useQuery(api.myFunctions.getUser, { email: user.emailAddresses[0].emailAddress });
    const createUser = useMutation(api.myFunctions.createUser);

    if (convexUser === undefined) return <div>Loading...</div>;

    if (convexUser === null) {
      createUser({
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        teamName: "New Team",
      });
      return <div>Creating your account...</div>;
    }

    return (
      <>
        <WelcomeDashboard user={{
          id: convexUser._id,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          imageUrl: user.imageUrl || '',
        }} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Team on the Court</h2>
          <InteractiveCourtView />
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fantasy Basketball Dashboard</h1>
        <UserButton afterSignOutUrl="/"/>
      </div>
      <ConvexDashboard />
    </div>
  )
}