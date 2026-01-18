export type RoleCategory =
    | "CEO"
    | "Engineering"
    | "Design"
    | "Legal"
    | "Sales"
    | "COO"
    | "Dog"
    | "Vibe";

export interface TeamMember {
    id: string;
    name: string;
    role: RoleCategory;
    annualSalary: number;
    buff: string;
    debuff: string;
    avatar: string;
    audioPath?: string;
    quote?: string;
}

export const DREAM_TEAM_OPTIONS: TeamMember[] = [
    // --- CEO ---
    {
        id: "ceo-musk",
        name: "Elon Musk",
        role: "CEO",
        annualSalary: 1000000000000,
        buff: "Engineers fear disappointing him more than death.",
        debuff: "Announces pivot to unrelated industry mid-sprint.",
        avatar: "musk.png"
    },
    {
        id: "ceo-cook",
        name: "Tim Cook",
        role: "CEO",
        annualSalary: 100000000,
        buff: "Supply chain runs like clockwork.",
        debuff: "Kills every idea that isn't incrementally better than last year's idea.",
        avatar: "cook.png",
        audioPath: "good-morning",
        quote: "Good Morning"
    },
    {
        id: "ceo-barra",
        name: "Mary Barra",
        role: "CEO",
        annualSalary: 30000000,
        buff: "Boards, regulators, and enterprise customers trust you instantly.",
        debuff: "No one calls the company 'exciting' on LinkedIn.",
        avatar: "barra.png"
    },
    {
        id: "ceo-roy",
        name: "Logan Roy",
        role: "CEO",
        annualSalary: 60000000,
        buff: "Competitors are terrified.",
        debuff: "HR lawsuits increase 400%.",
        avatar: "logan-roy.png",
        audioPath: "roy",
        quote: "I'm back"
    },
    {
        id: "ceo-leslie",
        name: "Leslie Knope",
        role: "CEO",
        annualSalary: 95000,
        buff: "Team morale is absurdly high. Has personalized binders for every employee.",
        debuff: "Mandatory fun takes up 40% of work hours. 847 unread celebration emails.",
        avatar: "knope.png",
        audioPath: "knope",
        quote: "I am often inspired by myself"
    },
    {
        id: "ceo-stark",
        name: "Tony Stark",
        role: "CEO",
        annualSalary: 180000000,
        buff: "Breakthrough tech years ahead of competitors.",
        debuff: "Office destroyed by supervillain monthly.",
        avatar: "stark.png",
        audioPath: "stark",
        quote: "Oh, great"
    },
    {
        id: "ceo-holmes",
        name: "Elizabeth Holmes",
        role: "CEO",
        annualSalary: 0,
        buff: "Raises enormous rounds on pure vision. Press and investors are hypnotized.",
        debuff: "Product does not work. Company implodes.",
        avatar: "holmes.png"
    },
    {
        id: "ceo-operator",
        name: "Experienced Startup Operator",
        role: "CEO",
        annualSalary: 450000,
        buff: "Executes predictably. Team knows what's happening.",
        debuff: "No one is excited. No one is terrified.",
        avatar: "operator.png"
    },
    {
        id: "ceo-friend",
        name: "Your High School Friend",
        role: "CEO",
        annualSalary: 0,
        buff: "Extremely loyal, will work equity and vibes.",
        debuff: "Does not know what a 'Term Sheet' is.",
        avatar: "high-school.png"
    },

    // --- ENGINEERING ---
    {
        id: "eng-alexandr-wang",
        name: "Alexandr Wang",
        role: "Engineering",
        annualSalary: 14000000000,
        buff: "Single-handedly justifies a $14B strategic investment.",
        debuff: "Company roadmap bends around his existence.",
        avatar: "wang.png"
    },
    {
        id: "eng-karpathy",
        name: "Andrej Karpathy",
        role: "Engineering",
        annualSalary: 25000000,
        buff: "Explains neural networks so well they start working better.",
        debuff: "Occasionally disappears to write a 200-page blog post.",
        avatar: "karpathy.png"
    },
    {
        id: "eng-carmack",
        name: "John Carmack",
        role: "Engineering",
        annualSalary: 12000000,
        buff: "Runs 120 FPS on hardware that should not support it.",
        debuff: "Still mentally lives in 1997.",
        avatar: "carmack.png"
    },
    {
        id: "eng-torvalds",
        name: "Linus Torvalds",
        role: "Engineering",
        annualSalary: 8000000,
        buff: "Writes code that outlives companies.",
        debuff: "Will publicly shame you for bad design decisions.",
        avatar: "torvalds.png"
    },
    {
        id: "eng-hamilton",
        name: "Margaret Hamilton",
        role: "Engineering",
        annualSalary: 10000000,
        buff: "Prevents catastrophic failure by inventing discipline.",
        debuff: "Makes the rest of the team feel wildly underqualified.",
        avatar: "hamilton.png"
    },
    {
        id: "eng-turing",
        name: "Alan Turing",
        role: "Engineering",
        annualSalary: 9000000,
        buff: "Invents an entirely new field overnight.",
        debuff: "Needs several decades for society to catch up.",
        avatar: "turing.png"
    },
    {
        id: "eng-gilfoyle",
        name: "Bertram Gilfoyle",
        role: "Engineering",
        annualSalary: 600000,
        buff: "Servers never go down.",
        debuff: "Mines Bitcoin on company hardware.",
        avatar: "gilfoyle.png",
        audioPath: "gilfoyle",
        quote: "I feel I should get more equity"
    },
    {
        id: "eng-bighead",
        name: "Nelson Bighetti",
        role: "Engineering",
        annualSalary: 1200000,
        buff: "Offers you a sip of his slurpee, boosting morale.",
        debuff: "Has no idea why any of this works.",
        avatar: "bighead.png"
    },

    // --- DESIGN ---
    {
        id: "des-ive",
        name: "Sir Jony Ive",
        role: "Design",
        annualSalary: 6500000000,
        buff: "Aluminum.",
        debuff: "Removed all buttons; users are lost.",
        avatar: "ive.png"
    },
    {
        id: "des-mode",
        name: "Edna Mode",
        role: "Design",
        annualSalary: 6000000,
        buff: "World-class branding.",
        debuff: "Fires anyone wearing a cape.",
        avatar: "edna.png",
        audioPath: "edna",
        quote: "NO CAPES!"
    },
    {
        id: "des-anderson",
        name: "Wes Anderson",
        role: "Design",
        annualSalary: 12000000,
        buff: "Perfectly symmetrical UI.",
        debuff: "Release delayed 4 years for kerning.",
        avatar: "wes.png"
    },
    {
        id: "des-template",
        name: "Stolen Figma Template",
        role: "Design",
        annualSalary: 0,
        buff: "Looks clean and modern.",
        debuff: "You look like every other SaaS startup.",
        avatar: "figma.png"
    },
    {
        id: "des-hadid",
        name: "Zaha Hadid",
        role: "Design",
        annualSalary: 20000000,
        buff: "Futuristic, gravity-defying design language.",
        debuff: "Users cannot tell where anything begins or ends.",
        avatar: "hadid.png"
    },
    {
        id: "des-dieter",
        name: "Dieter Rams",
        role: "Design",
        annualSalary: 8000000,
        buff: "Design so clear it explains itself.",
        debuff: "Will delete half your features.",
        avatar: "rams.png"
    },
    {
        id: "des-gehry",
        name: "Frank Gehry",
        role: "Design",
        annualSalary: 18000000,
        buff: "Every product looks iconic and museum-worthy.",
        debuff: "No two surfaces align; engineers are crying.",
        avatar: "ghery.png"
    },

    // --- LEGAL ---
    {
        id: "law-goodman",
        name: "Saul Goodman",
        role: "Legal",
        annualSalary: 1200000,
        buff: "You can get away with anything.",
        debuff: "Accidentally laundering cartel money.",
        avatar: "saul.png"
    },
    {
        id: "law-specter",
        name: "Harvey Specter",
        role: "Legal",
        annualSalary: 6000000,
        buff: "Wins every negotiation.",
        debuff: "Delegates the real legal work to someone without a law degree.",
        avatar: "specter.png"
    },
    {
        id: "law-white",
        name: "Mary Jo White",
        role: "Legal",
        annualSalary: 10000000,
        buff: "Regulators suddenly take you very seriously.",
        debuff: "Every mistake is now a federal matter.",
        avatar: "white.png"
    },
    {
        id: "law-student",
        name: "1L Law Student",
        role: "Legal",
        annualSalary: 0,
        buff: "Technically a legal set of eyes.",
        debuff: "Gets all advice from Reddit's /r/legaladvice.",
        avatar: "student.png"
    },
    {
        id: "law-kardashian",
        name: "Kim Kardashian",
        role: "Legal",
        annualSalary: 15000000,
        buff: "Unmatched attention, influence, and access to the right people.",
        debuff: "Still technically becoming a lawyer.",
        avatar: "kim.png",
        audioPath: "kim",
        quote: "Get your f**king @$$ up and work"
    },
    {
        id: "law-chatgpt",
        name: "ChatGPT",
        role: "Legal",
        annualSalary: 240,
        buff: "Instant legal-sounding answers.",
        debuff: "Cites laws that do not exist.",
        avatar: "chat.png"
    },

    // --- SALES & HYPE ---
    {
        id: "sale-mrbeast",
        name: "MrBeast",
        role: "Sales",
        annualSalary: 240000000,
        buff: "100M users in 10 minutes.",
        debuff: "Might give your startup away in a challenge.",
        avatar: "beast.png",
        audioPath: "beast",
        quote: "I'm sitting on five million dollars in cash"
    },
    {
        id: "sale-gc",
        name: "Ex-Oracle Enterprise AE",
        role: "Sales",
        annualSalary: 1800000,
        buff: "Closes seven-figure deals with a single email.",
        debuff: "Sales cycle measured in fiscal years.",
        avatar: "oracle.png"
    },
    {
        id: "sale-belfort",
        name: "Jordan Belfort",
        role: "Sales",
        annualSalary: 12000000,
        buff: "Revenue goes to the moon.",
        debuff: "Office is currently being raided by FBI.",
        avatar: "belfort.png"
    },
    {
        id: "sale-usedcar",
        name: "Used Car Salesman",
        role: "Sales",
        annualSalary: 80000,
        buff: "Closes deals on the spot through pure pressure.",
        debuff: "Customers regret everything five minutes later.",
        avatar: "car-salesman.png"
    },
    {
        id: "sale-conference",
        name: "Conference Booth with Free Swag",
        role: "Sales",
        annualSalary: 250000,
        buff: "Generates endless leads and email signups.",
        debuff: "None of them convert.",
        avatar: "booth.png"
    },
    {
        id: "sale-bot",
        name: "X Bot Farm",
        role: "Sales",
        annualSalary: 6000,
        buff: "50k retweets instantly.",
        debuff: "Zero real customers.",
        avatar: "x-logo.png"
    },

    // --- DOG ---
    {
        id: "dog-goldie",
        name: "Golden Retriever",
        role: "Dog",
        annualSalary: 6000,
        buff: "Morale +100%.",
        debuff: "Carpet cleaning fees are astronomical.",
        avatar: "golden.png"
    },
    {
        id: "dog-snoop",
        name: "Snoop Dogg",
        role: "Dog",
        annualSalary: 24000000,
        buff: "Startup is now officially 'cool'.",
        debuff: "Smoke sets off fire sprinklers daily.",
        avatar: "snoop.png",
        audioPath: "snoop",
    },
    {
        id: "dog-crusty",
        name: "Crusty Old Chihuahua",
        role: "Dog",
        annualSalary: 1200,
        buff: "Fearlessly guards the office with pure attitude.",
        debuff: "Hates meetings, mailmen, and joy.",
        avatar: "crusty.png"
    },
    {
        id: "dog-cat",
        name: "Office Cat",
        role: "Dog",
        annualSalary: 3000,
        buff: "Keeps rodents and egos in check.",
        debuff: "Not a dog.",
        avatar: "cat.png"
    },
    {
        id: "dog-corgi",
        name: "Office Corgi",
        role: "Dog",
        annualSalary: 8000,
        buff: "Short legs, long-term morale gains.",
        debuff: "Stops productivity for surprise belly rubs.",
        avatar: "corgi.png"
    }
];