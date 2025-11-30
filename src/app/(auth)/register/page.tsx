"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, AlertCircle, Check, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// Comprehensive error codes mapping for better-auth
const errorCodes: Record<string, string> = {
  // Password related errors
  PASSWORD_TOO_SHORT: "Şifre en az 8 karakter olmalıdır.",
  PASSWORD_TOO_LONG: "Şifre çok uzun. Maksimum 128 karakter olmalıdır.",
  INVALID_PASSWORD: "Geçersiz şifre formatı.",
  WEAK_PASSWORD: "Şifre çok zayıf. Lütfen daha güçlü bir şifre seçin.",
  
  // User related errors
  USER_ALREADY_EXISTS: "Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.",
  INVALID_EMAIL: "Geçersiz e-posta adresi formatı.",
  INVALID_EMAIL_OR_PASSWORD: "Geçersiz e-posta veya şifre.",
  
  // General errors
  VALIDATION_ERROR: "Girilen bilgiler geçersiz. Lütfen kontrol edin.",
  RATE_LIMIT_EXCEEDED: "Çok fazla deneme yaptınız. Lütfen biraz bekleyin.",
  INTERNAL_SERVER_ERROR: "Sunucu hatası oluştu. Lütfen tekrar deneyin.",
  
  // Name related
  INVALID_NAME: "Geçersiz isim formatı.",
  NAME_TOO_SHORT: "İsim çok kısa.",
  NAME_TOO_LONG: "İsim çok uzun.",
};

const getErrorMessage = (code: string, message?: string): string => {
  // First check our mapped codes
  if (code in errorCodes) {
    return errorCodes[code];
  }
  
  // If we have a message from the server, try to make it user-friendly
  if (message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("password") && lowerMessage.includes("short")) {
      return "Şifre en az 8 karakter olmalıdır.";
    }
    if (lowerMessage.includes("password") && lowerMessage.includes("long")) {
      return "Şifre çok uzun.";
    }
    if (lowerMessage.includes("email") && lowerMessage.includes("exist")) {
      return "Bu e-posta adresi zaten kayıtlı.";
    }
    if (lowerMessage.includes("email") && lowerMessage.includes("invalid")) {
      return "Geçersiz e-posta adresi.";
    }
    
    // Return the original message if it's somewhat readable
    if (message.length < 100 && !message.includes("{") && !message.includes("Error:")) {
      return message;
    }
  }
  
  return "Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.";
};

// Password strength checker
const checkPasswordStrength = (password: string) => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
  
  return checks;
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const passwordStrength = checkPasswordStrength(password);
  const allPasswordChecksPassed = Object.values(passwordStrength).every(Boolean);

  const validateForm = (): string | null => {
    // Name validation
    if (name.trim().length < 2) {
      return "İsim en az 2 karakter olmalıdır.";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Geçerli bir e-posta adresi girin.";
    }
    
    // Password validation
    if (password.length < 8) {
      return "Şifre en az 8 karakter olmalıdır.";
    }
    
    if (password.length > 128) {
      return "Şifre en fazla 128 karakter olabilir.";
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      return "Şifreler eşleşmiyor.";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        password,
      });

      if (error) {
        const errorMessage = getErrorMessage(error.code || "", error.message);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      toast.success("Hesabınız başarıyla oluşturuldu!");
      router.push("/login?registered=true");
    } catch (err) {
      toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      setIsLoading(false);
    }
  };

  const PasswordHint = ({ passed, text }: { passed: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs ${passed ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}>
      {passed ? (
        <Check className="w-3 h-3" />
      ) : (
        <X className="w-3 h-3" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold">NotesAI</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Hesap Oluştur</CardTitle>
            <CardDescription>AI destekli not uygulamasına hoş geldiniz</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="off"
                  minLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordHints(true)}
                  required
                  disabled={isLoading}
                  autoComplete="off"
                  minLength={8}
                />
                {showPasswordHints && password.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg space-y-1.5 mt-2">
                    <PasswordHint passed={passwordStrength.minLength} text="En az 8 karakter" />
                    <PasswordHint passed={passwordStrength.hasUppercase} text="En az 1 büyük harf (A-Z)" />
                    <PasswordHint passed={passwordStrength.hasLowercase} text="En az 1 küçük harf (a-z)" />
                    <PasswordHint passed={passwordStrength.hasNumber} text="En az 1 rakam (0-9)" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="off"
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    Şifreler eşleşmiyor
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Hesap oluşturuluyor...
                  </>
                ) : (
                  "Hesap Oluştur"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Zaten hesabınız var mı?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Giriş yapın
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}