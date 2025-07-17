const fs = require("fs").promises
const path = require("path")
const bcrypt = require("bcryptjs")

async function createDemoUsers() {
  const dataDir = path.join(process.cwd(), "data")

  // Ensure data directory exists
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }

  // Create demo users
  const demoUsers = [
    {
      id: "demo-customer-1",
      name: "Demo Customer",
      email: "customer@demo.com",
      password: await bcrypt.hash("password", 12),
      role: "customer",
      phone: "+1-555-0123",
      address: "123 Demo Street",
      city: "Demo City",
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-mechanic-1",
      name: "Demo Mechanic",
      email: "mechanic@demo.com",
      password: await bcrypt.hash("password", 12),
      role: "mechanic",
      phone: "+1-555-0124",
      address: "456 Service Avenue",
      city: "Demo City",
      experience: "5-10",
      specializations: "Residential wiring, Emergency repairs, Panel upgrades",
      certifications: "Licensed Electrician #12345, OSHA Safety Certified",
      rating: 4.8,
      completedJobs: 47,
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
  ]

  // Save demo users
  await fs.writeFile(path.join(dataDir, "users.json"), JSON.stringify(demoUsers, null, 2))

  console.log("Demo users created successfully!")
  console.log("Customer: customer@demo.com / password")
  console.log("Mechanic: mechanic@demo.com / password")
}

createDemoUsers().catch(console.error)
