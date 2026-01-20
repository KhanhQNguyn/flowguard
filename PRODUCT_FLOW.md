## FlowGuard Complete Product Flow & Architecture

```mermaid
graph TB
    subgraph "User Entry & Authentication"
        A["App Launch<br/>(/) Root"] --> B{Check User<br/>Role}
        B -->|Not Set| C["Redirect to /home<br/>(Citizen Default)"]
        B -->|Citizen| C
        B -->|Admin| D["Redirect to<br/>/admin/dashboard"]
    end

    subgraph "Citizen User Journey"
        C --> E["Home Page /home<br/>- Risk Indicator<br/>- Current Conditions<br/>- Premium Banner"]
        E -->|Premium Not Active| F["Show Premium Banner"]
        F -->|Click Banner| G["Premium Modal<br/>- Trial CTA<br/>- Plan Comparison"]
        G -->|Upgrade| H["Subscription /subscription"]
        H -->|Confirm Payment| I["Access Premium Features"]
        E -->|Navigate Safely| J["Navigate Page /navigate<br/>- Destination Input<br/>- Route Suggestions<br/>- Trip Tracking"]
        J -->|Start Navigation| K["Open Google Maps<br/>- Safe Route<br/>- Real-time GPS"]
        K -->|Return to App| L["Post-Trip Modal<br/>- Feedback<br/>- Report Accuracy"]
        L -->|Confirm Trip| M["Earn FlowPoints<br/>+ 10-50 pts"]
        M --> N["Reward Success Modal"]
        N --> O["Points Added<br/>to Account"]
        E -->|Report Flooding| P["Report Page /report<br/>- Photo Upload<br/>- Location Detect<br/>- AI Analysis"]
        P -->|Submit Report| Q["Earn FlowPoints<br/>+ 5 pts"]
        Q --> R["Report Confirmed"]
        E -->|Rewards| S["Rewards /rewards<br/>- FlowPoints Balance<br/>- Activity Summary"]
        S --> T["Partner Vouchers<br/>Grid"]
        T -->|Redeem Voucher| U["Use FlowPoints<br/>to Get Discount"]
        U --> V["Voucher Code<br/>Generated"]
        S --> W["View Earning<br/>Rules"]
        W --> X["Learn How to<br/>Earn Points"]
        S --> Y["Redemption<br/>Options"]
        Y -->|Select Reward| Z["Claim Reward<br/>FlowPoints Debited"]
        E -->|Profile| AA["Profile /profile<br/>- User Info<br/>- Trip History<br/>- Settings"]
        AA -->|Switch Role| AB["Toggle to Admin<br/>Mode"]
        AA -->|View Premium| AC["Subscription /subscription<br/>- Current Plan<br/>- Billing History<br/>- Features List"]
        AA -->|Sign Out| AD["Clear Local<br/>Storage"]
    end

    subgraph "Admin Workflow"
        D --> AE["Admin Dashboard<br/>/admin/dashboard<br/>- System KPIs<br/>- Alert Overview"]
        AE --> AF["Navigation Tabs"]
        AF -->|Map| AG["Sensor Map<br/>/admin/map<br/>- Leaflet Map<br/>- Real-time Markers<br/>- Location Click"]
        AF -->|Sensors| AH["Sensors /admin/sensors<br/>- Status List<br/>- Battery Level<br/>- Water Level"]
        AF -->|Reports| AI["Community Reports<br/>/admin/reports<br/>- Flood Reports<br/>- Verification<br/>- Analytics"]
        AF -->|Users| AJ["User Management<br/>/admin/users<br/>- Account Info<br/>- Activity Logs"]
        AF -->|Partnerships| AK["Partnerships /admin/partnerships<br/>- Active Partners<br/>- Commission Tracking<br/>- Performance Metrics<br/>- Payment Processing"]
        AK -->|View Partner| AL["Partner Detail Modal<br/>- Contact Info<br/>- Commission Rate<br/>- Total Earnings<br/>- Monthly Breakdown"]
        AL -->|Process Payment| AM["Record Commission<br/>Payment"]
        AM --> AN["Update Partner<br/>Balance"]
        AF -->|Analytics| AO["Analytics Page<br/>/admin/analytics<br/>- Detailed Reports<br/>- Trends<br/>- Forecasts"]
    end

    subgraph "Monetization Features"
        H -->|Free Plan| AP["Features:<br/>- Basic Navigation<br/>- Standard Reports<br/>- 50 FlowPoints/month<br/>- Community Rewards"]
        H -->|Premium Monthly| AQ["Features:<br/>- Advanced Routing<br/>- Priority Alerts<br/>- 200 FlowPoints/month<br/>- Partner Vouchers<br/>- Ad-Free<br/>29.99/mo"]
        H -->|Premium Yearly| AR["Features:<br/>- All Premium+<br/>- Offline Maps<br/>- 300 FlowPoints/month<br/>- Early Access<br/>99.99/yr"]
        H -->|Trial| AS["7-Day Free Trial<br/>- Full Premium Access<br/>- Auto-renews unless<br/>cancelled<br/>- Available once"]
        AP --> AT["Free + Partnership"]
        AQ --> AU["Premium + Partnership"]
        AR --> AV["Premium + Partnership"]
        AS --> AW["Trial + Partnership"]
        AT -->|Partnership Commission| AX["30% per sale<br/>Commission Pool"]
        AU -->|Partnership Commission| AX
        AV -->|Partnership Commission| AX
        AW -->|Partnership Commission| AX
        AX --> AY["Track by:<br/>- Partner ID<br/>- Date Range<br/>- Revenue Source"]
    end

    subgraph "Data & Context Layers"
        BA["useApp Context<br/>- currentDistrict<br/>- currentRisk<br/>- sensors[]<br/>- refreshData()"]
        BB["useUser Context<br/>- userPoints<br/>- userTier<br/>- addFlowPoints()"]
        BC["usePremium Context<br/>- subscription<br/>- isPremium<br/>- isTrialActive<br/>- cancelSubscription()"]
        BD["usePartnership Context<br/>- partnerships[]<br/>- commissions[]<br/>- getPartnerMetrics()"]
        BA --> BE["Mock Data:<br/>- sensors-full.ts<br/>- districts.ts<br/>- alerts.ts"]
        BB --> BF["localStorage<br/>- userPoints<br/>- tripHistory<br/>- settings"]
        BC --> BG["localStorage<br/>- subscription<br/>- trialDate<br/>- billingCycle"]
        BD --> BH["localStorage<br/>- partnerships<br/>- commissions<br/>- vouchers"]
    end

    subgraph "Key Integration Points"
        BI["Bottom Navigation<br/>- 6 Tabs<br/>- Home<br/>- Navigate<br/>- Report<br/>- Rewards<br/>- Premium<br/>- Profile"]
        BJ["Admin Header Nav<br/>- 6 Routes<br/>- Dashboard<br/>- Map<br/>- Sensors<br/>- Reports<br/>- Users<br/>- Partnerships"]
        BK["Layout Hierarchy<br/>- Citizen Layout<br/>  + All Providers<br/>  + Bottom Nav<br/>- Admin Layout<br/>  + Header Nav<br/>  + Main Content"]
    end

    O --> C
    V --> S
    Z --> S
    AM --> AK
    C -.->|Responsive<br/>Mobile First| BE
    AE -.->|Analytics<br/>Real-time| BA

    style A fill:#e8f4f8
    style G fill:#f3e8ff
    style H fill:#f3e8ff
    style I fill:#d1fae5
    style S fill:#fef08a
    style AK fill:#f3e8ff
    style AM fill:#dbeafe
    style BI fill:#f5f5f5
    style BJ fill:#f5f5f5
```

### System Architecture

```mermaid
graph LR
    subgraph "Frontend Layer"
        FC["React Components<br/>- Pages<br/>- Modals<br/>- Cards"]
        CT["Context Providers<br/>- AppContext<br/>- UserContext<br/>- PremiumContext<br/>- PartnershipContext"]
        HS["Hooks & Utilities<br/>- useRouter<br/>- useState<br/>- useEffect"]
    end

    subgraph "Data Layer"
        LC["localStorage<br/>- Persistent State<br/>- User Preferences<br/>- Subscription Data"]
        MD["Mock Data<br/>- Sensors<br/>- Districts<br/>- Partners<br/>- Vouchers"]
    end

    subgraph "External Services"
        GM["Google Maps API<br/>- Navigation<br/>- Route Planning"]
        PC["Payment Gateway<br/>- Stripe Integration<br/>- Billing"]
    end

    FC --> CT
    CT --> HS
    HS --> LC
    HS --> MD
    FC --> GM
    FC --> PC

    style FC fill:#dbeafe
    style CT fill:#fce7f3
    style LC fill:#fef08a
    style MD fill:#d1fae5
    style GM fill:#e9d5ff
    style PC fill:#f3e8ff
```

### State Management Flow

```mermaid
stateDiagram-v2
    [*] --> AppInitialized
    AppInitialized --> UserRole_Selected: Load Role
    UserRole_Selected --> Role_Check: Determine Path
    Role_Check --> CitizenMode: Citizen Selected
    Role_Check --> AdminMode: Admin Selected
    
    CitizenMode --> Home: /home
    Home --> NavigatePage: /navigate
    Home --> ReportPage: /report
    Home --> RewardsPage: /rewards
    Home --> SubscriptionPage: /subscription
    Home --> ProfilePage: /profile
    
    NavigatePage --> TripActive: Started Navigation
    TripActive --> PostTrip: Returned to App
    PostTrip --> PointsEarned: Confirmed Trip
    
    ReportPage --> ReportSubmitted: Photo + Location
    ReportSubmitted --> PointsEarned: Verified
    
    RewardsPage --> ViewVouchers: Browse Partners
    ViewVouchers --> RedeemVoucher: Select Offer
    RedeemVoucher --> VoucherGenerated: Points Deducted
    
    SubscriptionPage --> PremiumActive: Upgrade
    PremiumActive --> PremiumFeatures: Access Premium
    PremiumFeatures --> SubscriptionPage: Manage Plan
    
    AdminMode --> Dashboard: /admin/dashboard
    Dashboard --> MapView: /admin/map
    Dashboard --> SensorsMgmt: /admin/sensors
    Dashboard --> ReportsMgmt: /admin/reports
    Dashboard --> UsersMgmt: /admin/users
    Dashboard --> Partnerships: /admin/partnerships
    
    Partnerships --> ViewPartner: Click Partner
    ViewPartner --> CommissionTracking: See Metrics
    CommissionTracking --> ProcessPayment: Settle Commission

    style CitizenMode fill:#d1fae5
    style AdminMode fill:#fce7f3
    style PremiumActive fill:#fef08a
    style PointsEarned fill:#dbeafe
```

### Revenue Streams & Commission Flows

```mermaid
graph TB
    subgraph "Revenue Sources"
        R1["Premium Subscriptions<br/>Monthly: 29.99<br/>Yearly: 99.99<br/>Trial: Free 7 Days"]
        R2["Partner Commissions<br/>30% per sale<br/>Payment Processing<br/>Monthly Settlement"]
        R3["Data Monetization<br/>Anonymized<br/>Traffic Patterns<br/>Risk Analytics"]
    end

    subgraph "Commission Tracking"
        C1["Partner Signs Up<br/>- Commission Rate: 30%<br/>- Status: Active"]
        C2["User Clicks<br/>Partner Link<br/>- trackable<br/>- User ID logged"]
        C3["User Converts<br/>- Purchase Made<br/>- Commission: 30%"]
        C4["Monthly Settlement<br/>- Calculate Total<br/>- Process Payment<br/>- Update Balance"]
    end

    subgraph "FlowPoints Economy"
        P1["Earning Channels<br/>- Safe Navigation: +10<br/>- Successful Route: +25<br/>- Flood Report: +5<br/>- Community: +50"]
        P2["Redemption Options<br/>- Partner Vouchers<br/>- Exclusive Rewards<br/>- Cash Back"]
        P3["Tier Rewards<br/>- Bronze: 0-100pts<br/>- Silver: 100-500<br/>- Gold: 500+"]
    end

    R1 --> MonthlyRecurring["Monthly Recurring<br/>Revenue"]
    R2 --> CommissionRevenue["Variable Commission<br/>Revenue"]
    R3 --> DataRevenue["Data Analytics<br/>Revenue"]
    
    MonthlyRecurring --> TotalRevenue["Total Revenue<br/>Dashboard"]
    CommissionRevenue --> TotalRevenue
    DataRevenue --> TotalRevenue
    
    C1 --> C2 --> C3 --> C4 --> PartnerPayment["Partner Payment<br/>Processed"]
    
    P1 --> P2 --> P3 --> UserEngagement["User Engagement<br/>& Retention"]

    style R1 fill:#fef08a
    style R2 fill:#f3e8ff
    style R3 fill:#dbeafe
    style TotalRevenue fill:#f87171
    style PartnerPayment fill:#86efac
    style UserEngagement fill:#a7f3d0
```

### Feature Access Matrix

```mermaid
table
    tr
        td: b Feature
        td: b Free
        td: b Premium (Monthly)
        td: b Premium (Yearly)
        td: b Trial (7 Days)
    tr
        td: Basic Navigation
        td: ✓
        td: ✓
        td: ✓
        td: ✓
    tr
        td: Advanced Routing
        td: ✗
        td: ✓
        td: ✓
        td: ✓
    tr
        td: Priority Alerts
        td: ✗
        td: ✓
        td: ✓
        td: ✓
    tr
        td: Ad-Free Experience
        td: ✗
        td: ✓
        td: ✓
        td: ✓
    tr
        td: Offline Maps
        td: ✗
        td: ✗
        td: ✓
        td: ✗
    tr
        td: Monthly FlowPoints
        td: 50
        td: 200
        td: 300
        td: 200
    tr
        td: Partner Vouchers
        td: Basic
        td: Premium
        td: Premium+
        td: Premium
    tr
        td: Early Feature Access
        td: ✗
        td: ✗
        td: ✓
        td: ✗
    tr
        td: Support Priority
        td: Standard
        td: Priority
        td: VIP
        td: Priority
```

### Key Metrics & Analytics

```mermaid
graph LR
    subgraph "User Metrics"
        UM1["Total Users"]
        UM2["Active Users"]
        UM3["Premium Conversion"]
        UM4["Trial-to-Paid"]
    end

    subgraph "Engagement Metrics"
        EM1["Routes Planned"]
        EM2["Reports Submitted"]
        EM3["FlowPoints Earned"]
        EM4["Avg Session Time"]
    end

    subgraph "Revenue Metrics"
        RM1["MRR<br/>Monthly Recurring"]
        RM2["ARR<br/>Annual Recurring"]
        RM3["LTV<br/>Lifetime Value"]
        RM4["CAC<br/>Customer Acquisition"]
    end

    subgraph "Partner Metrics"
        PM1["Active Partners"]
        PM2["Total Commissions"]
        PM3["Avg Commission<br/>Per Partner"]
        PM4["Partner ROI"]
    end

    UM1 --> Dashboard["Admin Dashboard<br/>Real-time Analytics"]
    EM1 --> Dashboard
    RM1 --> Dashboard
    PM1 --> Dashboard

    style UM1 fill:#dbeafe
    style EM1 fill:#d1fae5
    style RM1 fill:#fef08a
    style PM1 fill:#f3e8ff
    style Dashboard fill:#f5f5f5
```
