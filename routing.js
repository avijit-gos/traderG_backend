const express = require("express");
const router = express.Router();

const UserRoute = require("./routes/user_route");
const AdminRoute = require("./routes/admin_route");
const NotificationRoute = require("./routes/notification_route");
const ChatRoute = require("./routes/chat_route");
const QueryRoute = require("./routes/query_route");
const ArticleRoute = require("./routes/article_route");
const AssetRoute = require("./routes/asset_route");
const SettingsRoute = require("./routes/settings_routes");
const TimePeriodRoute = require("./routes/time_period_route");
const ProductRoute = require("./routes/product_route");
const AccountCreationRequestRoute = require("./routes/account_creation_request_route");
//const TradingReportRoute = require("./routes/trading_report_route");
const fileUploadRouter = require("./routes/file_upload_route");
const CertificateRoute = require("./routes/certificate_route");
const DownloadRoute = require("./routes/download_route");
const ReportRoute = require("./routes/report_route");
const ReferralRoute = require("./routes/referral_route");
const HelplineRoute = require("./routes/helpline_route");
const HoldingRoute = require("./routes/holding_route");
const HoldingWalletRoute = require("./routes/holding_wallet_route");
const WithdrawalRoute = require("./routes/withdrawal_route");
const PreShareRoute = require("./routes/preshare_route");
const KycRoute = require("./routes/kyc_route");
const WalletRoute = require("./routes/wallet_route");
const ReportListRoute = require("./routes/report_list_route");
const BankAccountRoute = require("./routes/bank_account_route");
const TradingRoute = require("./routes/trading_route");
// const fileReadRouter = require("./routes/read_csv");
const CsvLogRoute = require("./routes/trading_log_route");
const DashboardRoute = require("./routes/dashboard_route");
const CashfreeRouter = require("./routes/cashfree_route");
const TestRoute = require("./routes/test_route");
const SearchRoute = require("./routes/search_route");
const TradingDashboardRoute = require("./routes/trading_dashboard_route");
const BrokerageNewLogRoute = require("./routes/brokerage_new_log_route");
const BankRoute = require("./routes/bank_route");
const AdminBankRoute = require("./routes/adminBank_route");
const BrokerRoute = require("./routes/broker_route");
const BrokerProfileRoute = require("./routes/broker_profile_route");
const ConsultantRoute = require("./routes/consultant_route");
const SubscriptionRoute = require("./routes/subscription_route");
const UserSubscriptionRoute = require("./routes/user_subscription_route");
const RoleRoute = require("./routes/role_route");
const InvestmentAccountRoute = require("./routes/newInvestment_account_route");
const PreShareTransferRoute = require("./routes/preShare_tansfer_route");
const OfficeDataRoute = require("./routes/office_data_route");



router.use("/user", UserRoute);
router.use("/admin", AdminRoute);
router.use("/notification",NotificationRoute);
router.use("/chat", ChatRoute);
router.use("/query", QueryRoute);
router.use("/article", ArticleRoute);
router.use("/asset", AssetRoute);
router.use("/settings",SettingsRoute);
router.use("/time_period",TimePeriodRoute);
router.use("/product",ProductRoute);
router.use("/account_creation_request",AccountCreationRequestRoute);
//router.use("/trading-report",TradingReportRoute);
router.use("/file", fileUploadRouter);
router.use("/certificate", CertificateRoute);
router.use("/download", DownloadRoute);
router.use("/report", ReportRoute);
router.use("/referral", ReferralRoute);
router.use("/helpline", HelplineRoute);
router.use("/holding", HoldingRoute);
router.use("/holding-wallet", HoldingWalletRoute);
router.use("/withdrawal", WithdrawalRoute);
router.use("/pre-share", PreShareRoute);
router.use("/kyc", KycRoute);
router.use("/wallet", WalletRoute);
router.use("/report-data", ReportListRoute);
router.use("/bank-account", BankAccountRoute);
router.use("/trading",TradingRoute)
// router.use("/file-read",fileReadRouter)
router.use("/csv-logs",CsvLogRoute)
router.use("/dashboard",DashboardRoute)
router.use("/cashfree",CashfreeRouter);
router.use("/search",SearchRoute);
router.use("/test-data",TestRoute);
router.use("/trading-data",TradingDashboardRoute);
router.use("/brokerage-data",BrokerageNewLogRoute);
router.use("/bank",BankRoute);
router.use("/admin-bank",AdminBankRoute);
router.use("/broker",BrokerRoute);
router.use("/broker-profile",BrokerProfileRoute);
router.use("/consultant",ConsultantRoute);
router.use("/subscription",SubscriptionRoute);
router.use("/user-subscription",UserSubscriptionRoute);
router.use("/role",RoleRoute);
router.use("/new-inv",InvestmentAccountRoute);
router.use("/share-transfer",PreShareTransferRoute);
router.use("/office_data",OfficeDataRoute)


module.exports = router;