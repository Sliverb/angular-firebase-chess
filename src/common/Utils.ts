export class Utils {

    // Helper function to generate a pseudo random token
    public static GenToken(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 8; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    public static IsStringNullOrEmpty(input: string): boolean {
        try {
            return (!input) || (!(input.trim()));
        } catch (error) {
            return true;
        }
    }
}
