import Papa from "papaparse";
import { useEffect, useState } from "react";
import "./index.css";

type AlphabetEntry = {
	upper: string;
	lower: string;
	translation: string;
	ipa: string;
	pronunciation: string;
	englishEquivelent: string;
};

function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text);
}

function speakLetter(text: string) {
	new Audio(`${text}.mp3`).play();
}

function CyrillicAlphabet() {
	const [selectedLetter, setSelectedLetter] = useState<AlphabetEntry | null>(null);
	const [alphabet, setAlphabet] = useState<AlphabetEntry[]>([]);

	useEffect(() => {
		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape") setSelectedLetter(null);
		});

		fetch("alphabet.csv")
			.then((res) => res.text())
			.then((data) => {
				const rows = Papa.parse(data, { header: true, skipEmptyLines: true });

				setAlphabet(
					(rows.data as { [key: string]: string }[]).map(
						(record) =>
							({
								upper: record["Bulgarian upper"],
								lower: record["Bulgarian lower"],
								translation: record["Official transliteration"],
								ipa: record["IPA"],
								pronunciation: record["Pronunciation of letter"],
								englishEquivelent: record["English equivalent"],
							} as AlphabetEntry)
					)
				);
			});
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-6xl mx-auto">
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
					{alphabet.map((letter, index) => (
						<div
							key={index}
							onClick={() => setSelectedLetter(letter)}
							className="bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer p-4 text-center border-2 border-transparent hover:border-indigo-300"
						>
							<div className="text-3xl font-bold text-indigo-900 mb-2">{letter.upper}</div>
							<div className="text-2xl text-indigo-600">{letter.lower}</div>
						</div>
					))}
				</div>

				{selectedLetter && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
						onClick={(e) => {
							if (e.target === e.currentTarget) setSelectedLetter(null);
						}}
					>
						<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-y-auto">
							<div className="p-6">
								<div className="flex justify-between items-start mb-6">
									<div className="">
										<div className="text-6xl font-bold text-indigo-900 mb-2">
											{selectedLetter.upper} {selectedLetter.lower}
										</div>
										<div className="text-2xl font-bold text-indigo-600 mb-2">
											English - {selectedLetter.translation}
										</div>
									</div>
									<button
										onClick={() => setSelectedLetter(null)}
										className="text-gray-500 hover:text-gray-700 transition-colors"
									>
										<img className="w-6 h-6" src="x.svg" />
									</button>
								</div>

								<div className="space-y-4">
									<div className="bg-indigo-50 rounded-lg p-4">
										<h3 className="text-lg font-semibold text-indigo-900 mb-2 flex items-center gap-2">
											Pronunciation
											<button
												onClick={() => speakLetter(selectedLetter.lower)}
												className="text-indigo-600 hover:text-indigo-800 transition-colors"
											>
												<img className="w-6 h-6" src="volume.svg" />
											</button>
										</h3>
										<p className="text-indigo-700 text-xl font-mono">
											{selectedLetter.ipa} - {selectedLetter.pronunciation}
										</p>
									</div>

									<div className="bg-green-50 rounded-lg p-4">
										<h3 className="text-lg font-semibold text-green-900 mb-2">Example Word</h3>
										<p className="text-green-700">{selectedLetter.englishEquivelent}</p>
									</div>

									<div className="flex gap-2">
										<button
											onClick={() => copyToClipboard(selectedLetter.upper)}
											className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
										>
											<img className="w-6 h-6" src="copy.svg" />
											Copy {selectedLetter.upper}
										</button>
										<button
											onClick={() => copyToClipboard(selectedLetter.lower)}
											className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
										>
											<img className="w-6 h-6" src="copy.svg" />
											Copy {selectedLetter.lower}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default CyrillicAlphabet;
