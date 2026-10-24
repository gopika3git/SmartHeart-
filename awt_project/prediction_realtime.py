from prediction import CardiacRiskPredictor

def get_binary_input(prompt):
    while True:
        val = input(prompt + " (1 for Yes / 0 for No): ").strip()
        if val in ['0', '1']:
            return int(val)
        print("[!] Invalid input. Please enter 1 for Yes or 0 for No.")

def run_user_friendly_cli():
    try:
        predictor = CardiacRiskPredictor()
    except Exception:
        print("[Error] Model or scaler file not found. Please run 'python train.py' first!")
        return

    print("\n============================================================")
    print("    EASY CARDIAC RISK CHECKER (FOR EVERYONE)                ")
    print("============================================================\n")
    print("Answer a few simple everyday questions to estimate your heart risk:\n")

    try:
        age = float(input("1. What is your age in years? (e.g. 45): "))
        
        print("\n2. What is your gender assigned at birth?")
        sex_choice = input("   Enter 1 for Male / 0 for Female: ").strip()
        sex = 1 if sex_choice == '1' else 0

        height_cm = float(input("\n3. What is your height in centimeters? (e.g. 170): "))
        weight_kg = float(input("4. What is your weight in kilograms? (e.g. 70): "))

        print("\n5. Do you have high blood pressure?")
        print("   (If you don't know your exact top number, enter '120' for normal or '140' if high)")
        bp_sys = float(input("   Enter Top Blood Pressure Number (Systolic, e.g., 120): "))

        high_sugar = get_binary_input("\n6. Do you have high blood sugar or diabetes?")
        exercise = get_binary_input("7. Do you exercise at least 30 mins a day (3+ times a week)?")
        chol_high = get_binary_input("8. Has a doctor told you that your cholesterol is high?")
        family_history = get_binary_input("9. Has anyone in your close family (parents/siblings) had heart disease?")
        smoking = get_binary_input("10. Do you smoke cigarettes or tobacco regularly?")
        alcohol = get_binary_input("11. Do you consume alcohol regularly or heavily?")

        user_inputs = [
            age, sex, height_cm, weight_kg, bp_sys, 
            high_sugar, exercise, chol_high, family_history, smoking, alcohol
        ]

        result = predictor.predict(user_inputs)

        print("\n" + "=" * 55)
        print("                   YOUR RESULTS SUMMARY                     ")
        print("=" * 55)
        print(f" Calculated Body Mass Index (BMI) : {result['bmi']}")
        print(f" Cardiac Risk Category           : {result['status']}")
        print(f" Estimated Cardiac Risk Level    : {result['risk_probability_pct']}%")
        print("=" * 55)

        if result['risk_prediction'] == 1:
            print("\n[!] Advice: Your risk score is elevated. Consider consulting a healthcare professional for a routine check-up.")
        else:
            print("\n[+] Great news! Your estimated heart risk profile is currently low.")

    except ValueError:
        print("\n[Error] Invalid response detected. Please enter numeric values where requested.")

if __name__ == "__main__":
    run_user_friendly_cli()