/**
 * FALLBACK DATA - Used only if JSON files fail to load
 * This is minimal demo/placeholder data with no narrative content
 */

const loreData = {
    inbox: [],
    sent: [],
    trash: []
};

const staffUsers = [
    {
        username: "demo_user_01",
        name: "Demo User (Analyst)",
        department: "Department A",
        securityLevel: 2,
        accessCode: "DEMO-CODE-0001",
        status: "ACTIVE",
        emails: [
            {
                id: "D-0001",
                sender: "System",
                receiver: "demo_user_01",
                subject: "Welcome message",
                date: "2099-01-10",
                encryption: "STANDARD",
                signal: "95.0%",
                category: "inbox",
                tags: ["demo"],
                body: "Demo inbox message."
            }
        ]
    },
    {
        username: "demo_user_02",
        name: "Demo User (Command)",
        department: "Department B",
        securityLevel: 3,
        accessCode: "DEMO-CODE-0002",
        status: "ACTIVE",
        emails: [
            {
                id: "E-0001",
                sender: "System",
                receiver: "demo_user_02",
                subject: "Status message",
                date: "2099-01-12",
                encryption: "RSA-4096",
                signal: "96.0%",
                category: "inbox",
                tags: ["demo"],
                body: "Demo message for demo_user_02."
            }
        ]
    },
    {
        username: "demo_user_03",
        name: "Demo User (Security)",
        department: "Department C",
        securityLevel: 4,
        accessCode: "DEMO-CODE-0003",
        status: "ACTIVE",
        emails: [
            {
                id: "F-0001",
                sender: "System",
                receiver: "demo_user_03",
                subject: "High-level message",
                date: "2099-01-08",
                encryption: "RSA-4096",
                signal: "99.0%",
                category: "inbox",
                tags: ["demo"],
                body: "Demo message for demo_user_03."
            }
        ]
    }
];

const emails = [
    {
        id: "M-0001",
        sender: "System",
        receiver: "User",
        subject: "Welcome",
        date: "2099-01-01",
        encryption: "STANDARD",
        signal: "100.0%",
        category: "inbox",
        tags: ["demo"],
        body: "Demo email. Fallback data loaded."
    }
];

