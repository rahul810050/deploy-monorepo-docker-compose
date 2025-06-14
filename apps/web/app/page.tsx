"use server"

export default async function Home() {
  const users = await fetch("http://localhost:3001/api/v1/users");
  const usersData = await users.json();
  console.log(usersData.users)

  
  return (
    <div>
      <h1>Hello World</h1>
      {JSON.stringify(usersData.users)}
    </div>
  );
}
