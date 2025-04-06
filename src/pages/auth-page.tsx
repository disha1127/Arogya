import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n";
import { useLocation } from "wouter";
import { Loader2, Heart, Stethoscope, Activity, FileText, ClipboardCheck } from "lucide-react";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "usernameRequired" }),
  password: z.string().min(1, { message: "passwordRequired" }),
});

// Registration schema
const registerSchema = insertUserSchema
  .extend({
    confirmPassword: z.string().min(1, { message: "passwordRequired" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      role: "PATIENT",
    },
  });

  // Handle login submission
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  // Handle registration submission
  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Forms */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white rounded-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary-50 p-3">
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">{t("welcomeToArogya")}</CardTitle>
            <CardDescription className="text-gray-600 mt-2">{t("authDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2 bg-primary-50 p-1 rounded-lg">
                <TabsTrigger value="login" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">
                  {t("login")}
                </TabsTrigger>
                <TabsTrigger value="register" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">
                  {t("register")}
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 mt-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("username")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("enterUsername")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t("enterPassword")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("loggingIn")}
                        </>
                      ) : (
                        t("login")
                      )}
                    </Button>
                  </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                  <p>
                    {t("noAccount")} <Button variant="link" onClick={() => setActiveTab("register")} className="p-0">{t("registerNow")}</Button>
                  </p>
                </div>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 mt-4">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fullName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("enterFullName")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("email")}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t("enterEmail")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("username")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("enterUsername")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t("enterPassword")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("confirmPassword")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t("confirmYourPassword")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("registering")}
                        </>
                      ) : (
                        t("register")
                      )}
                    </Button>
                  </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                  <p>
                    {t("alreadyHaveAccount")} <Button variant="link" onClick={() => setActiveTab("login")} className="p-0">{t("loginNow")}</Button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right side: Hero content */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-600 via-primary-400 to-primary-500 p-8 flex flex-col justify-center">
        <div className="max-w-lg mx-auto text-white">
          <div className="mb-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-full shadow-xl">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 text-white text-center drop-shadow-md">
            {t("yourHealthJourney")}
          </h1>
          
          <p className="text-xl mb-10 text-white/90 text-center">
            {t("arogyaFeatures")}
          </p>
          
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 transition-all hover:scale-105 hover:bg-white/20 duration-300 shadow-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-white/20 p-3 mr-4 shadow-inner">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{t("symptomAnalysis")}</h3>
                  <p className="text-white/80 text-sm mt-1">{t("symptomCheckerDesc")}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 transition-all hover:scale-105 hover:bg-white/20 duration-300 shadow-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-white/20 p-3 mr-4 shadow-inner">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{t("healthTracking")}</h3>
                  <p className="text-white/80 text-sm mt-1">{t("healthTrackerDesc")}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 transition-all hover:scale-105 hover:bg-white/20 duration-300 shadow-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-white/20 p-3 mr-4 shadow-inner">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{t("documentStorage")}</h3>
                  <p className="text-white/80 text-sm mt-1">{t("documentStorageDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}